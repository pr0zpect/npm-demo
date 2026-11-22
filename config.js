import { envGuard } from "@pr0zpect/env-guard";

export const schema = {
  PORT: {
    type: "port",
    default: 3000,
    description: "Port number for the Express HTTP server",
  },
  NODE_ENV: {
    type: "enum",
    values: ["development", "production", "test"],
    default: "development",
    description: "Application runtime environment",
  },
  APP_NAME: {
    type: "string",
    default: "EnvGuard Express App",
    description: "Name of the application",
  },
  API_KEY: {
    type: "string",
    required: true,
    secret: true,
    default: process.env.API_KEY || "super-secret-production-token-999",
    description: "Secret token for protected routes",
  },
};

export const env = envGuard(schema);
