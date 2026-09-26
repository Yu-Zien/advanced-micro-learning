import { cpSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist-public");

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const file of ["index.html", "styles.css", ".nojekyll"]) {
  cpSync(path.join(root, file), path.join(output, file));
}
for (const directory of ["src", "vendor"]) {
  cpSync(path.join(root, directory), path.join(output, directory), { recursive: true });
}

console.log(`Public site staged at ${output}`);
