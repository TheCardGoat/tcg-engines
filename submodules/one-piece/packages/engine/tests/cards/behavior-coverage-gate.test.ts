import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vite-plus/test";
import * as cardExports from "@tcg/op-cards";
import type { OPCard } from "@tcg/op-types";

/**
 * Hard gate: every non-vanilla canonical ability card must have a command-driven
 * behavior test under tests/cards/** or src/cards/**.
 *
 * Both trees run in the package default suite (`vite.config.ts` include).
 * validateCardAbility-only placeholders use test.skip and do not count.
 */

const ENGINE_ROOT = join(fileURLToPath(new URL("../..", import.meta.url)));
const TESTS_CARDS_ROOT = join(ENGINE_ROOT, "tests/cards");
const SRC_CARDS_ROOT = join(ENGINE_ROOT, "src/cards");

function isCard(value: unknown): value is OPCard {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "cardType" in value &&
    typeof (value as OPCard).id === "string"
  );
}

function isBlank(text: string | undefined): boolean {
  return text === undefined || text.trim() === "" || /^(?:NULL|-)$/i.test(text.trim());
}

function isVanilla(card: OPCard): boolean {
  if (card.cardType === "don") return true;
  const effect = card.effect ?? card.i18n?.en?.effect;
  const trigger = "trigger" in card ? card.trigger : undefined;
  return isBlank(effect) && isBlank(trigger) && !card.effects;
}

function walkTestFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walkTestFiles(path);
    return entry.isFile() && entry.name.endsWith(".test.ts") ? [path] : [];
  });
}

/** Real public command / harness call sites only — not bare type imports. */
const COMMAND_MARKERS = [
  "playCard(",
  "play(",
  "activateEffect(",
  "activateMain(",
  "declareAttack(",
  "attack(",
  "resolveDecision(",
  "choose(",
  "accept(",
  "decline(",
  "endTurn(",
  "attachDon(",
  "OnePieceTestEngine.create(",
  "OnePieceTestEngine.fromState(",
];

function hasCommandDrivenProof(source: string): boolean {
  // Skip pure placeholders: validateCardAbility-only files use test.skip without real play.
  if (
    /validateCardAbility\s*\(/.test(source) &&
    !COMMAND_MARKERS.some((marker) => source.includes(marker)) &&
    !/define\w+Tests?\s*\(/.test(source)
  ) {
    return false;
  }
  if (COMMAND_MARKERS.some((marker) => source.includes(marker))) return true;
  if (/define\w+Tests?\s*\(/.test(source) && /from\s+["']\.\/.+\.shared/.test(source)) {
    return true;
  }
  return false;
}

/** Extract collector-style ids (OP09-045, EB02-008, ST01-014) from test text/filename. */
function extractCardIds(text: string): Set<string> {
  const ids = new Set<string>();
  for (const match of text.matchAll(/\b([A-Z]{1,4}\d{0,2}-\d{3})(?:_[a-zA-Z0-9]+)?\b/g)) {
    ids.add(match[1]!.toUpperCase());
  }
  for (const match of text.matchAll(/\b([a-z]{1,4}\d{0,2}-\d{3})\b/g)) {
    ids.add(match[1]!.toUpperCase());
  }
  return ids;
}

describe("card behavior coverage gate", () => {
  test("every non-vanilla canonical ability card has a command-driven behavior test", () => {
    const allCards = Object.values(cardExports as Record<string, unknown>).filter(isCard);
    const byCanonical = new Map<string, OPCard>();
    for (const card of allCards) {
      if (card.cardType === "don") continue;
      const key = `${card.cardType}:${card.canonicalId || card.id}`;
      if (!byCanonical.has(key)) byCanonical.set(key, card);
    }

    // Exclude gate/harness files so their own source/docs cannot mark IDs covered.
    const GATE_SELF = new Set([
      "behavior-coverage-gate.test.ts",
      "grade-a-coverage.test.ts",
      "grade-a-checker.ts",
    ]);
    const testFiles = [
      ...walkTestFiles(TESTS_CARDS_ROOT).filter((p) => !GATE_SELF.has(p.split("/").pop() ?? "")),
      ...walkTestFiles(SRC_CARDS_ROOT),
    ];
    /** base collector id (OP09-045) → has command-driven proof */
    const coveredBases = new Set<string>();
    let campaignOnlyCount = 0;
    let defaultSuiteCount = 0;

    for (const file of testFiles) {
      const source = readFileSync(file, "utf8");
      if (!hasCommandDrivenProof(source)) continue;
      const inDefault = file.includes(`${join("tests", "cards")}`);
      const stem = file.split("/").pop() ?? "";
      // Prefer filename stem for ID extraction so comment-only IDs in helpers
      // cannot satisfy the gate. Still include source for multi-card factories.
      const ids = extractCardIds(`${stem}\n${source}`);
      for (const id of ids) {
        const base = id.split("_")[0]!;
        if (!coveredBases.has(base)) {
          coveredBases.add(base);
          if (inDefault) defaultSuiteCount += 1;
          else campaignOnlyCount += 1;
        } else if (inDefault) {
          // already covered; track nothing
        }
      }
    }

    const missing: string[] = [];
    for (const card of byCanonical.values()) {
      if (isVanilla(card)) continue;
      const base = (card.canonicalId || card.id).split("_")[0]!.toUpperCase();
      if (!coveredBases.has(base)) {
        missing.push(`${card.cardType} ${card.canonicalId || card.id} (${card.name})`);
      }
    }

    // eslint-disable-next-line no-console
    console.info(
      `[coverage] command-driven bases: ${coveredBases.size}; campaign-only files scanned under src/cards; default-suite files under tests/cards. missing ability cards: ${missing.length}`,
    );

    expect(
      missing,
      [
        "Non-vanilla ability cards missing any command-driven behavior test:",
        ...missing.slice(0, 50),
        missing.length > 50 ? `…and ${missing.length - 50} more` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    ).toEqual([]);
  }, 60_000);
});
