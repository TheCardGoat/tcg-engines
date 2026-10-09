import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const owner = path.resolve(app, "../..");
const shared = path.join(owner, "packages/simulator-ui/src");
const output = path.join(app, "src/components/component-catalog/component-inventory.json");
const entries = new Map();
const visited = new Set();
const sourceCache = new Map();
const walk = (directory) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((item) =>
      item.isDirectory()
        ? walk(path.join(directory, item.name))
        : [path.join(directory, item.name)],
    );
const source = (file) => {
  if (sourceCache.has(file)) return sourceCache.get(file);
  const ast = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  sourceCache.set(file, ast);
  return ast;
};
function relativeModule(file, specifier) {
  if (!specifier.startsWith(".")) return undefined;
  const base = path.resolve(path.dirname(file), specifier.replace(/\.js$/, ""));
  return [`${base}.tsx`, `${base}.ts`, path.join(base, "index.ts")].find((p) => fs.existsSync(p));
}
// Follow barrels to the implementation and reject type-only declarations even
// when a legacy barrel omitted the explicit `type` keyword.
function implementation(file, name, seen = new Set()) {
  const key = `${file}:${name}`;
  if (seen.has(key)) return undefined;
  seen.add(key);
  for (const node of source(file).statements) {
    if (
      ts.isFunctionDeclaration(node) &&
      (node.name?.text === name ||
        (name === "default" &&
          node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)))
    )
      return file;
    if (
      ts.isVariableStatement(node) &&
      node.declarationList.declarations.some(
        (declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === name,
      )
    )
      return file;
    if (!ts.isExportDeclaration(node) || node.isTypeOnly) continue;
    const target =
      node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)
        ? relativeModule(file, node.moduleSpecifier.text)
        : file;
    if (!target) continue;
    if (node.exportClause && ts.isNamedExports(node.exportClause)) {
      const exported = node.exportClause.elements.find(
        (entry) => !entry.isTypeOnly && entry.name.text === name,
      );
      if (exported)
        return implementation(target, exported.propertyName?.text ?? exported.name.text, seen);
    } else if (!node.exportClause) {
      const result = implementation(target, name, seen);
      if (result) return result;
    }
  }
  return undefined;
}
const role = (name) =>
  /Provider|Controller|Context$|Collection$|Surface$/.test(name) ? "composition" : "visual";
function componentExport(file, name) {
  if (!/^[A-Z]/.test(name)) return false;
  // Acronyms such as PInfoZone are normal component names. Fully capitalized
  // constants need a component declaration instead of being counted as visuals.
  if (!/^[A-Z0-9_]+$/.test(name)) return true;
  for (const node of source(file).statements) {
    if (ts.isFunctionDeclaration(node) && node.name?.text === name) return true;
    if (!ts.isVariableStatement(node)) continue;
    const declaration = node.declarationList.declarations.find(
      (entry) => ts.isIdentifier(entry.name) && entry.name.text === name,
    );
    const initializer = declaration?.initializer;
    if (!initializer) continue;
    if (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer)) return true;
    if (
      ts.isCallExpression(initializer) &&
      /(?:^|\.)(memo|forwardRef|lazy|createContext)$/.test(initializer.expression.getText())
    )
      return true;
  }
  return false;
}
function readExports(file, game, publicOnly) {
  const visitKey = `${game}:${publicOnly}:${file}`;
  if (visited.has(visitKey)) return;
  visited.add(visitKey);
  const ast = source(file);
  for (const node of ast.statements) {
    if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const target = relativeModule(file, node.moduleSpecifier.text);
      if (!target) continue;
      if (!node.exportClause) {
        readExports(target, game, publicOnly);
        continue;
      }
      if (!ts.isNamedExports(node.exportClause) || node.isTypeOnly) continue;
      for (const entry of node.exportClause.elements) {
        const name = entry.name.text;
        if (entry.isTypeOnly) continue;
        const leaf = implementation(target, entry.propertyName?.text ?? name);
        if (!leaf || !componentExport(leaf, entry.propertyName?.text ?? name)) continue;
        const key =
          game === "shared" ? `${game}:${name}` : `${game}:${name}:${path.relative(app, leaf)}`;
        entries.set(key, {
          id: key,
          name,
          game,
          role: role(name),
          source: path.relative(owner, leaf).replaceAll(path.sep, "/"),
        });
      }
    }
    if (publicOnly) continue;
    const exported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported) continue;
    const names =
      ts.isFunctionDeclaration(node) && node.name
        ? [node.name.text]
        : ts.isVariableStatement(node)
          ? node.declarationList.declarations
              .filter((d) => ts.isIdentifier(d.name))
              .map((d) => d.name.text)
          : [];
    for (const name of names) {
      if (!componentExport(file, name)) continue;
      const key = `${game}:${name}:${path.relative(app, file)}`;
      entries.set(key, {
        id: key,
        name,
        game,
        role: role(name),
        source: path.relative(owner, file).replaceAll(path.sep, "/"),
      });
    }
  }
}
readExports(path.join(shared, "index.ts"), "shared", true);
for (const game of [
  "cyberpunk",
  "flesh-and-blood",
  "one-piece",
  "gundam",
  "riftbound",
  "alpha-clash",
  "grand-archive",
  "naruto",
]) {
  for (const file of walk(path.join(app, "src/games", game))) {
    if (
      !file.endsWith(".tsx") ||
      /\.test\.|\.(?:stories|story)\.|\/__tests__\/|\/testing\/|\/fixtures\//.test(file)
    )
      continue;
    // Route pages and providers are inventoried too; they are compositions, not standalone card primitives.
    readExports(file, game, false);
  }
}
const inventory = [...entries.values()].sort(
  (a, b) =>
    a.game.localeCompare(b.game) ||
    a.name.localeCompare(b.name) ||
    a.source.localeCompare(b.source),
);
const json = JSON.stringify(inventory, null, 2) + "\n";
if (process.argv.includes("--check")) {
  if (!fs.existsSync(output) || fs.readFileSync(output, "utf8") !== json) {
    console.error("Component inventory is stale. Run node scripts/catalog-inventory.mjs.");
    process.exitCode = 1;
  }
} else fs.writeFileSync(output, json);
console.log(
  `${inventory.length} exported components/compositions across the shared library and eight games.`,
);
