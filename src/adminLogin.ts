import { HttpService } from "@nestjs/common";
import {
  AuthenticationStrategy,
  ExternalAuthenticationService,
  Injector,
  Logger,
  RequestContext,
  RoleService,
  User,
} from "@vendure/core";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export type AuthData = {
  strategy: string;
  externalIdentifier: string;
};

export class KeycloakAuthenticationStrategy
  implements AuthenticationStrategy<AuthData>
{
  readonly name = "customAuth";
  private externalAuthenticationService: ExternalAuthenticationService;
  private httpService: HttpService;
  private roleService: RoleService;

  init(injector: Injector) {
    this.externalAuthenticationService = injector.get(
      ExternalAuthenticationService
    );
    this.httpService = injector.get(HttpService);
    this.roleService = injector.get(RoleService);
  }

  defineInputType(): DocumentNode {
    return gql`
      input authInput {
        strategy: String!
        externalIdentifier: String!
      }
    `;
  }

  async authenticate(
    ctx: RequestContext,
    data: AuthData
  ): Promise<User | false | undefined> {
    const user = await this.externalAuthenticationService.findAdministratorUser(
      ctx,
      data.strategy,
      data.externalIdentifier
    );
    console.log(data);
    console.log(user);
    if (user) {
      return user;
    }
    // When creating an Administrator, we need to know what Role(s) to assign.
    // In this example, we've created a "merchant" role and assign that to all
    // new Administrators. In a real implementation, you can have more complex
    // logic to map an external user to a given role.
    const roles = await this.roleService.findAll(ctx);
    const merchantRole = roles.items.find((r) => r.code === "administrator");
    if (!merchantRole) {
      Logger.error(`Could not find "merchant" role`);
      return false;
    }
    console.log(merchantRole);
    return this.externalAuthenticationService.createAdministratorAndUser(ctx, {
      strategy: data.strategy,
      externalIdentifier: data.externalIdentifier,
      identifier: "goldadmin",
      emailAddress: "goldn@admin.com",
      firstName: "goldn",
      lastName: "admin",
      roles: [merchantRole],
    });
  }
}
