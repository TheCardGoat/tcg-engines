import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join, relative } from "node:path";
import type { CardType } from "@tcg/gundam-types";
import { CARDS_DIR, REPO_ROOT } from "./_helpers.ts";
import { parseEffect } from "./parseEffect.ts";

interface StructuredCardEffectRecord {
  cardNumber: string;
  name: string;
  type: CardType;
  filePath: string;
  rawEffect?: string;
  effects: ReturnType<typeof parseEffect>;
  parseStatus: "no-effect" | "parsed" | "empty" | "partial";
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return [path];
  });
}

function matchString(src: string, key: string): string | undefined {
  const match = src.match(new RegExp(`${key}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  return match ? JSON.parse(`"${match[1]}"`) : undefined;
}

function isMeaningfulEffect(rawEffect: string | undefined): boolean {
  if (!rawEffect) return false;
  const normalized = rawEffect
    .replace(/<br\s*\/?>/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized || normalized === "-") return false;
  if (/^\(Rest a Resource when paying a cost\.\)$/i.test(normalized)) return false;
  if (/^\(At the start of the game, place 1 active EX Base\b/i.test(normalized)) return false;
  if (/^\(At the start of the game, the second-turn player places 1\b/i.test(normalized)) {
    return false;
  }
  return true;
}

function parseStatus(
  rawEffect: string | undefined,
  effects: ReturnType<typeof parseEffect>,
): StructuredCardEffectRecord["parseStatus"] {
  if (!isMeaningfulEffect(rawEffect)) return "no-effect";
  if (effects.length === 0) return "empty";
  if (effects.some((effect) => effect.directives.length === 0 && !effect.pilotKeyword))
    return "partial";
  return "parsed";
}

const outArg = process.argv.find((arg) => arg.startsWith("--out="));
const outPath = outArg
  ? join(REPO_ROOT, outArg.slice("--out=".length))
  : join(REPO_ROOT, "tools/gundam-card-parser/data/structured/card-effects.json");

const records: StructuredCardEffectRecord[] = walk(CARDS_DIR)
  .filter((file) => file.endsWith(".ts"))
  .filter((file) => !file.endsWith(".test.ts"))
  .filter((file) => !file.endsWith("/index.ts"))
  .map((file) => {
    const src = readFileSync(file, "utf8");
    const cardNumber = matchString(src, "cardNumber") ?? "UNKNOWN";
    const name = matchString(src, "name") ?? "Unknown";
    const type = (matchString(src, "type") ?? "unit") as CardType;
    const rawEffect = matchString(src, "effect");
    const effects = parseEffect(rawEffect, type);
    return {
      cardNumber,
      name,
      type,
      filePath: relative(REPO_ROOT, file),
      ...(rawEffect !== undefined ? { rawEffect } : {}),
      effects,
      parseStatus: parseStatus(rawEffect, effects),
    };
  })
  .sort((a, b) => a.cardNumber.localeCompare(b.cardNumber) || a.filePath.localeCompare(b.filePath));

const summary = {
  generatedAt: new Date().toISOString(),
  cardsScanned: records.length,
  noEffect: records.filter((record) => record.parseStatus === "no-effect").length,
  parsed: records.filter((record) => record.parseStatus === "parsed").length,
  partial: records.filter((record) => record.parseStatus === "partial").length,
  empty: records.filter((record) => record.parseStatus === "empty").length,
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify({ summary, cards: records }, null, 2)}\n`);
execSync(`vp fmt ${relative(REPO_ROOT, outPath)}`, { cwd: REPO_ROOT, stdio: "ignore" });

console.log(`Wrote ${relative(REPO_ROOT, outPath)}`);
console.log(JSON.stringify(summary, null, 2));

if (!existsSync(outPath)) {
  throw new Error(`Failed to write ${outPath}`);
}
