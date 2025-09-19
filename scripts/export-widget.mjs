import { mkdirSync, copyFileSync, readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
const version = pkg.version;

mkdirSync("out/exthalpy", { recursive: true });
mkdirSync(`out/exthalpy/${version}`, { recursive: true });

// SOURCE from Vite build:
const SRC = "dist/assistant.iife.js";

// 1) Permanent moving URL
copyFileSync(SRC, "out/exthalpy/assistant.js");

// 2) Optional pinned version (for internal rollbacks & debugging)
copyFileSync(SRC, `out/exthalpy/${version}/assistant.js`);
