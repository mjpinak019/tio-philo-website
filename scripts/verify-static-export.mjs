import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const output = path.resolve("out");
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
const failures = [];
let checked = 0;

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const file = path.join(directory, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}

function verifyAsset(reference, sourceFile) {
  if (!reference || /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(reference)) return;
  const clean = reference.replaceAll("&amp;", "&").split(/[?#]/)[0];
  if (!clean) return;
  let target;
  if (clean.startsWith("/")) {
    if (basePath && clean !== basePath && !clean.startsWith(`${basePath}/`)) {
      failures.push(`Missing base path in ${reference}`);
      return;
    }
    target = path.resolve(output, `.${decodeURIComponent(clean.slice(basePath.length))}`);
  } else {
    target = path.resolve(path.dirname(sourceFile), decodeURIComponent(clean));
  }
  if (path.relative(output, target).startsWith("..")) {
    failures.push(`Asset escapes export directory: ${reference}`);
  } else if (!existsSync(target)) {
    failures.push(`Missing file: ${reference} (from ${path.relative(output, sourceFile)})`);
  } else {
    checked++;
  }
}

if (!existsSync(path.join(output, "index.html"))) {
  throw new Error("Missing out/index.html. Run npm run build:pages first.");
}

for (const file of walk(output)) {
  if (file.endsWith(".html")) {
    const html = readFileSync(file, "utf8");
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) verifyAsset(match[1], file);
    if (html.includes("/_next/image?")) failures.push("Export still uses the Next.js image server.");
  } else if (file.endsWith(".css")) {
    for (const match of readFileSync(file, "utf8").matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
      verifyAsset(match[1], file);
    }
  }
}

if (failures.length) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}
console.log(`Static export verified: ${checked} local asset references, base path "${basePath || "/"}".`);
