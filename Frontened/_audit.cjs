const fs = require("fs");
const path = require("path");

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
  );

const files = walk("src").filter((f) => f.endsWith(".jsx") || f.endsWith(".css"));
const css = files
  .filter((f) => f.endsWith(".css"))
  .map((f) => fs.readFileSync(f, "utf8"))
  .join("\n");

const defined = new Set(
  [...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1])
);

const used = new Set();
for (const f of files.filter((f) => f.endsWith(".jsx"))) {
  const s = fs.readFileSync(f, "utf8");
  const re = /className\s*=\s*\{?\s*["'`]([^"'`]+)["'`]/g;
  let m;
  while ((m = re.exec(s))) {
    m[1]
      .split(/\s+/)
      .forEach((c) => {
        if (c && !c.includes("$")) used.add(c);
      });
  }
}

const missing = [...used].filter((c) => !defined.has(c)).sort();
console.log("USED:", used.size, "DEFINED:", defined.size);
console.log("MISSING (" + missing.length + "):\n" + missing.join("\n"));
