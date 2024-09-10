/**
 * Retrieves the configuration based on the current environment.
 * @returns The configuration object for the current environment.
 * @throws Error if the environment is unknown.
 */
import { Config } from "./config.interface";
const env = process.env.NODE_ENV || "development";

let config: Config;

if (env === "development") {
  config = require("./config.development").default;
} else if (env === "production") {
  config = require("./config.production").default;
} else {
  throw new Error(`Unknown environment: ${env}`);
}

export default config;
