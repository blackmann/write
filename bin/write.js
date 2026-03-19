#!/usr/bin/env node
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [, , command, ...args] = process.argv;

const cwdFlag = args.find((a) => a.startsWith("--cwd="))?.slice("--cwd=".length);
const writeCwd = cwdFlag ? resolve(cwdFlag) : process.cwd();

process.env.WRITE_CWD = writeCwd;
process.chdir(packageDir);

if (command === "dev") {
  const bin = resolve(packageDir, "node_modules/.bin/react-router");
  const child = spawn(bin, ["dev"], {
    stdio: "inherit",
    env: { ...process.env, WRITE_CWD: writeCwd },
  });
  child.on("exit", (code) => process.exit(code ?? 0));
} else {
  await import(resolve(packageDir, "build/server/index.js"));
}
