const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
let checked = 0;
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const file = path.join(root, match[1]);
  if (!fs.existsSync(file)) throw Error("Missing local asset: " + match[1]);
  if (file.endsWith(".js")) {
    new vm.Script(fs.readFileSync(file, "utf8"), { filename: file });
    checked++;
  }
}
for (const name of fs.readdirSync(path.join(root, "css"))) {
  const css = fs.readFileSync(path.join(root, "css", name), "utf8");
  for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
    if (!fs.existsSync(path.resolve(root, "css", match[1])))
      throw Error("Missing CSS asset: " + match[1]);
  }
}
console.log(
  `${checked} JavaScript files parse. All linked project assets exist.`,
);
