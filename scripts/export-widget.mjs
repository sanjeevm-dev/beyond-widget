import { mkdirSync, copyFileSync, readFileSync, existsSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
const version = pkg.version;

mkdirSync("out/exthalpy", { recursive: true });
mkdirSync(`out/exthalpy/${version}`, { recursive: true });

const SRC = "dist/assistant.iife.js";

if (!existsSync(SRC)) {
  console.error(`❌ Build failed: ${SRC} not found. Did you run vite build?`);
  process.exit(1);
}

// 1) Permanent moving URL
copyFileSync(SRC, "out/exthalpy/assistant.js");

// 2) Optional pinned version (for rollbacks & debugging)
copyFileSync(SRC, `out/exthalpy/${version}/assistant.js`);

console.log("✅ Widget exported to /out/exthalpy/");
