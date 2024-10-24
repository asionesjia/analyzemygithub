import createJiti from "jiti";
import {fileURLToPath} from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env/server.ts");
jiti("./src/env/client.ts");
/** @type {import("next").NextConfig} */
const config = {};

export default config;
