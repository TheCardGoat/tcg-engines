import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { Card } from "@tcg/gundam-types";

export const __dirname = dirname(fileURLToPath(import.meta.url));
export const CARDS_DIR = join(__dirname, "../../../packages/cards/src/cards");
export const REPO_ROOT = join(__dirname, "../../..");

export function cardNumber(id: string): string {
  return id.split("-")[1] ?? id;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toConstName(name: string, cardNum: string, setId: string): string {
  const camel = name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase())
    .join("");
  return `${setId.toLowerCase()}${camel}${cardNum}`;
}

export function writeSetIndex(dir: string, exports: string[]): void {
  writeFileSync(join(dir, "index.ts"), exports.join("\n") + "\n");
}

export function renderCatalogMetadataLines(card: Card): string[] {
  const lines: string[] = [];
  if (card.id !== undefined) lines.push(`  id: ${JSON.stringify(card.id)},`);
  if (card.externalId !== undefined)
    lines.push(`  externalId: ${JSON.stringify(card.externalId)},`);
  if (card.slug !== undefined) lines.push(`  slug: ${JSON.stringify(card.slug)},`);
  if (card.displayName !== undefined)
    lines.push(`  displayName: ${JSON.stringify(card.displayName)},`);
  if (card.rulesText !== undefined) lines.push(`  rulesText: ${JSON.stringify(card.rulesText)},`);
  if (card.set !== undefined) lines.push(`  set: ${JSON.stringify(card.set)},`);
  if (card.printNumber !== undefined)
    lines.push(`  printNumber: ${JSON.stringify(card.printNumber)},`);
  if (card.printings !== undefined) {
    lines.push(`  printings: ${JSON.stringify(card.printings)},`);
  }
  if (card.selectedPrintingId !== undefined) {
    lines.push(`  selectedPrintingId: ${JSON.stringify(card.selectedPrintingId)},`);
  }
  if (card.imageUrl !== undefined) lines.push(`  imageUrl: ${JSON.stringify(card.imageUrl)},`);
  if (card.sourceImageUrl !== undefined) {
    lines.push(`  sourceImageUrl: ${JSON.stringify(card.sourceImageUrl)},`);
  }
  if (card.artist !== undefined) lines.push(`  artist: ${JSON.stringify(card.artist)},`);
  if (card.sourceUrl !== undefined) lines.push(`  sourceUrl: ${JSON.stringify(card.sourceUrl)},`);
  if (card.legality !== undefined) lines.push(`  legality: ${JSON.stringify(card.legality)},`);
  return lines;
}

const CARD_TYPE_DIRS = ["unit", "pilot", "command", "base", "resource"] as const;

export function updateRootIndex(): void {
  const allSetIds = existsSync(CARDS_DIR)
    ? readdirSync(CARDS_DIR, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort()
    : [];

  const lines: string[] = [];
  for (const setId of allSetIds) {
    for (const typeDir of CARD_TYPE_DIRS) {
      if (existsSync(join(CARDS_DIR, setId, typeDir, "index.ts"))) {
        lines.push(`export * from "./${setId}/${typeDir}/index.ts";`);
      }
    }
  }

  mkdirSync(CARDS_DIR, { recursive: true });
  writeFileSync(join(CARDS_DIR, "index.ts"), lines.join("\n") + "\n");
}

export function fmtDir(dir: string): void {
  try {
    execSync(`vp fmt ${dir}`, { stdio: "inherit", cwd: REPO_ROOT });
  } catch {
    // fmt is best-effort; don't fail the pipeline
  }
}
