import { createHash } from "node:crypto";
import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { grandArchiveCatalog } from "../../../packages/cards/src/generated/grand-archive-catalog.ts";
import {
  GRAND_ARCHIVE_ABILITY_COMPILER_VERSION,
  compileGrandArchiveAbilities,
} from "../../../packages/cards/scripts/compile-card-abilities.ts";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const cardsRoot = path.join(workspaceRoot, "packages/cards/src/cards");
const generatedRoot = path.join(workspaceRoot, "packages/cards/src/generated");
const manifestPath = path.join(generatedRoot, "grand-archive-generation-manifest.json");

async function sourceFiles(root: string): Promise<readonly string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(root, entry.name);
      if (entry.isDirectory()) return sourceFiles(target);
      return entry.isFile() && target.endsWith(".ts") && !target.endsWith(".test.ts")
        ? [target]
        : [];
    }),
  );
  return files.flat().sort((left, right) => left.localeCompare(right));
}

const generatedFiles = [
  ...(await sourceFiles(cardsRoot)),
  path.join(generatedRoot, "grand-archive-catalog.ts"),
  path.join(generatedRoot, "grand-archive-card-registry.ts"),
].sort((left, right) => left.localeCompare(right));
const fingerprint = createHash("sha256");
for (const file of generatedFiles) {
  fingerprint.update(path.relative(workspaceRoot, file));
  fingerprint.update("\0");
  fingerprint.update(await readFile(file));
  fingerprint.update("\0");
}

let abilityCount = 0;
let unparsedAbilityCount = 0;
for (const card of grandArchiveCatalog.cards) {
  const faces = [card, ...card.relatedFaces];
  for (const face of faces) {
    const report = compileGrandArchiveAbilities({
      canonicalId: face.canonicalId,
      name: face.name,
      rulesText: face.effectRaw ?? "",
      types: face.types,
    });
    abilityCount += report.executableParagraphs + report.unparsedParagraphs;
    unparsedAbilityCount += report.unparsedParagraphs;
  }
}
if (unparsedAbilityCount !== 0)
  throw new Error(
    `Generation refused: ${unparsedAbilityCount} ability paragraphs remain unparsed.`,
  );

const manifest = {
  schemaVersion: 1,
  snapshot: grandArchiveCatalog.provenance,
  compilerVersion: GRAND_ARCHIVE_ABILITY_COMPILER_VERSION,
  cardCount: grandArchiveCatalog.cards.length,
  abilityCount,
  outputFingerprint: {
    algorithm: "sha256",
    value: fingerprint.digest("hex"),
    files: generatedFiles.map((file) => path.relative(workspaceRoot, file)),
  },
};
const temporary = `${manifestPath}.tmp`;
await writeFile(temporary, `${JSON.stringify(manifest, null, 2)}\n`);
await rename(temporary, manifestPath);
console.log(
  `Wrote generation manifest for ${manifest.cardCount} cards and ${manifest.abilityCount} abilities.`,
);
