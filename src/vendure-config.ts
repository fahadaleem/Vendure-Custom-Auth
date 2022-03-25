import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  LanguageCode,
} from "@vendure/core";
import { defaultEmailHandlers, EmailPlugin } from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import path from "path";
import { KeycloakAuthenticationStrategy } from "./adminLogin";

export const config: VendureConfig = {
  apiOptions: {
    port: 3000,
    adminApiPath: "admin-api",
    adminApiPlayground: {
      settings: {
        "request.credentials": "include",
      } as any,
    }, // turn this off for production
    adminApiDebug: true, // turn this off for production
    shopApiPath: "shop-api",
    shopApiPlayground: {
      settings: {
        "request.credentials": "include",
      } as any,
    }, // turn this off for production
    shopApiDebug: true, // turn this off for production
  },
  authOptions: {
    adminAuthenticationStrategy: [new KeycloakAuthenticationStrategy()],
    // superadminCredentials:{
    //   password:"superadmin",
    //   identifier:"superadmin"
    // }
  },
  dbConnectionOptions: {
    type: "postgres",
    synchronize: true, // turn this off for production
    logging: false,
    database: "vendure",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1234",
    migrations: [path.join(__dirname, "../migrations/*.ts")],
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  customFields: {
    Product: [
      {
        name: "service_type",
        type: "string",
        label: [{ languageCode: LanguageCode.en, value: "Service Type" }],
        ui: { component: "select-form-input" },
        options: [
          {
            value: "GRAPHIC_DESIGNING",
            label: [
              { languageCode: LanguageCode.en, value: "Graphic Designing" },
            ],
          },
          {
            value: "COSMETICS",
            label: [{ languageCode: LanguageCode.en, value: "Cosmetics" }],
          },
          {
            value: "ELECTRONICS",
            label: [{ languageCode: LanguageCode.en, value: "Electronics" }],
          },
          {
            value: "GIFT_PRODUCT",
            label: [{ languageCode: LanguageCode.en, value: "Gift Products" }],
          },
          {
            value: "SERVICE_TYPE_2",
            label: [{ languageCode: LanguageCode.en, value: "Service Type 2" }],
          },
          {
            value: "SERVICE_TYPE_3",
            label: [{ languageCode: LanguageCode.en, value: "Service Type 3" }],
          },
        ],
      },
    ],
  },
  plugins: [
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "../static/assets"),
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, "../static/email/test-emails"),
      route: "mailbox",
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, "../static/email/templates"),
      globalTemplateVars: {
        // The following variables will change depending on your storefront implementation
        fromAddress: '"example" <noreply@example.com>',
        verifyEmailAddressUrl: "http://localhost:8080/verify",
        passwordResetUrl: "http://localhost:8080/password-reset",
        changeEmailAddressUrl:
          "http://localhost:8080/verify-email-address-change",
      },
    }),
    AdminUiPlugin.init({
      route: "admin",
      port: 3002,
    }),
  ],
};
