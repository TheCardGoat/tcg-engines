import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const cardsRoot = path.join(workspaceRoot, "packages/cards/src/cards");
const generatedRoot = path.join(workspaceRoot, "packages/cards/src/generated");

async function generatedFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(root, entry.name);
      if (entry.isDirectory()) return generatedFiles(target);
      return entry.isFile() && target.endsWith(".ts") && !target.endsWith(".test.ts")
        ? [target]
        : [];
    }),
  );
  return files.flat();
}

async function siblingTestFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(root, entry.name);
      if (entry.isDirectory()) return siblingTestFiles(target);
      return entry.isFile() && target.endsWith(".test.ts") ? [target] : [];
    }),
  );
  return files.flat();
}

async function filesFingerprint(files) {
  const hash = createHash("sha256");
  for (const file of files.sort((left, right) => left.localeCompare(right))) {
    hash.update(path.relative(workspaceRoot, file));
    hash.update("\0");
    hash.update(await readFile(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}

async function fingerprint() {
  const files = [
    ...(await generatedFiles(cardsRoot)),
    path.join(generatedRoot, "grand-archive-catalog.ts"),
    path.join(generatedRoot, "grand-archive-card-registry.ts"),
    path.join(generatedRoot, "grand-archive-generation-manifest.json"),
  ].sort((left, right) => left.localeCompare(right));
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(path.relative(workspaceRoot, file));
    hash.update("\0");
    hash.update(await readFile(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function generate() {
  const result = spawnSync("pnpm", ["run", "generate"], {
    cwd: workspaceRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const committedOutput = await fingerprint();
const committedTests = await filesFingerprint(await siblingTestFiles(cardsRoot));
generate();
const firstRegeneration = await fingerprint();
const firstRegenerationTests = await filesFingerprint(await siblingTestFiles(cardsRoot));
if (committedTests !== firstRegenerationTests)
  throw new Error("Grand Archive generation changed or removed sibling card tests.");
if (committedOutput !== firstRegeneration)
  throw new Error(
    "Generated Grand Archive output is stale. Run pnpm generate and commit the result.",
  );
generate();
const secondRegeneration = await fingerprint();
const secondRegenerationTests = await filesFingerprint(await siblingTestFiles(cardsRoot));
if (committedTests !== secondRegenerationTests)
  throw new Error("Grand Archive generation changed or removed sibling card tests.");
if (firstRegeneration !== secondRegeneration)
  throw new Error("Grand Archive generation is not reproducible across consecutive runs.");
console.log(`Verified reproducible generated output (${secondRegeneration}).`);
