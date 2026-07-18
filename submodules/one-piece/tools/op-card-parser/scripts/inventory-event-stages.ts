import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { CardEffects, EventCard, StageCard } from "@tcg/op-types";
import { buildCardEffects } from "../src/effect-parser/index.ts";

type InventoryCard = EventCard | StageCard;
type InventoryType = InventoryCard["cardType"];
type AuditStatus = "mismatch" | "pass" | "vanilla";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIR = join(__dirname, "..");
const CARDS_DIR = join(PACKAGE_DIR, "../../packages/cards/src/cards");
const ENGINE_TESTS_DIR = join(PACKAGE_DIR, "../../packages/engine/tests/cards");

interface CliOptions {
  cardType: InventoryType;
  set?: string;
  write: boolean;
}

interface InventoryEntry {
  storedSet: string;
  id: string;
  canonicalId: string;
  name: string;
  file: string;
  exported: boolean;
  printedText: boolean;
  structuredEffects: boolean;
  behaviorTest: boolean;
  auditStatus: AuditStatus;
}

function usage(): never {
  console.error("Usage: vp run inventory:<events|stages> -- [--set <STORED_SET>] [--write]");
  console.error("Example: vp run inventory:events -- --set OP01");
  process.exit(2);
}

function parseArgs(args: string[]): CliOptions {
  const requestedType = args[0];
  if (requestedType !== "event" && requestedType !== "stage") usage();
  let set: string | undefined;
  let write = false;
  for (let index = 1; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === "--") continue;
    if (argument === "--write") {
      write = true;
      continue;
    }
    if (argument === "--set") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) usage();
      set = value.toUpperCase();
      index += 1;
      continue;
    }
    usage();
  }
  return { cardType: requestedType, set, write };
}

function definitionFiles(cardType: InventoryType): string[] {
  const plural = cardType === "event" ? "events" : "stages";
  const files: string[] = [];
  for (const setEntry of readdirSync(CARDS_DIR, { withFileTypes: true })) {
    if (!setEntry.isDirectory()) continue;
    const setDirectory = join(CARDS_DIR, setEntry.name);
    const directory = join(setDirectory, plural);
    if (existsSync(directory)) {
      files.push(
        ...readdirSync(directory, { withFileTypes: true })
          .filter(
            (entry) =>
              entry.isFile() &&
              entry.name.endsWith(".ts") &&
              !entry.name.endsWith(".i18n.ts") &&
              entry.name !== "index.ts",
          )
          .map((entry) => join(directory, entry.name)),
      );
    }
    const legacyIndex = join(setDirectory, "index.ts");
    if (
      existsSync(legacyIndex) &&
      readFileSync(legacyIndex, "utf8").includes(`cardType: "${cardType}"`)
    ) {
      files.push(legacyIndex);
    }
  }
  return files.sort();
}

async function loadCards(file: string, cardType: InventoryType): Promise<InventoryCard[]> {
  const module = (await import(`${pathToFileURL(file).href}?inventory=${Date.now()}`)) as Record<
    string,
    unknown
  >;
  return Object.values(module).filter(
    (value): value is InventoryCard =>
      typeof value === "object" &&
      value !== null &&
      "cardType" in value &&
      value.cardType === cardType,
  );
}

function printedText(card: InventoryCard): string {
  const effectText = card.effect ?? card.i18n.en.effect;
  const triggerText =
    card.trigger && !/(?:^|\n)\s*\[Trigger\]/i.test(effectText ?? "")
      ? `[Trigger] ${card.trigger}`
      : undefined;
  return [effectText, triggerText]
    .filter((text): text is string => Boolean(text?.trim()))
    .join("\n");
}

function stable(value: unknown): string {
  return JSON.stringify(value ?? null);
}

function auditStatus(
  text: string,
  generated: CardEffects | undefined,
  checkedIn: CardEffects | undefined,
): AuditStatus {
  if (!text) return checkedIn ? "mismatch" : "vanilla";
  return generated && stable(generated) === stable(checkedIn) ? "pass" : "mismatch";
}

function allTestSources(directory: string): Array<{ file: string; source: string }> {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return allTestSources(path);
    return entry.isFile() && entry.name.endsWith(".test.ts")
      ? [{ file: path, source: readFileSync(path, "utf8") }]
      : [];
  });
}

function hasBehaviorTest(
  tests: Array<{ file: string; source: string }>,
  card: InventoryCard,
): boolean {
  const canonicalPrefix = card.canonicalId.toLowerCase();
  return tests.some(({ file }) => {
    const stem = file
      .slice(file.lastIndexOf("/") + 1)
      .replace(/\.test\.ts$/, "")
      .toLowerCase();
    return stem.startsWith(`${canonicalPrefix}-`) || stem === canonicalPrefix;
  });
}

function renderMarkdown(cardType: InventoryType, entries: InventoryEntry[]): string {
  const title = cardType === "event" ? "Event" : "Stage";
  const lines = [
    `# One Piece ${title} Inventory`,
    "",
    `Generated by \`vp run inventory:${cardType === "event" ? "events" : "stages"} -- --write\`. Do not edit by hand.`,
    "",
    "A parser `pass` means the checked-in structured effects exactly match a fresh",
    "transformation of the stored English printed text. It does not replace",
    "semantic review or command-driven behavior proof.",
    "",
    "<!-- prettier-ignore -->",
    "| Stored set | ID | Canonical ID | Name | Text | Structured | Audit | Exported | Behavior test | Definition |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const card of entries) {
    lines.push(
      `| ${card.storedSet} | ${card.id} | ${card.canonicalId} | ${card.name.replaceAll("|", "\\|")} | ${card.printedText ? "yes" : "no"} | ${card.structuredEffects ? "yes" : "no"} | ${card.auditStatus} | ${card.exported ? "yes" : "no"} | ${card.behaviorTest ? "yes" : "no"} | \`${card.file.replaceAll("\\", "/")}\` |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

const options = parseArgs(process.argv.slice(2));
const tests = allTestSources(
  join(ENGINE_TESTS_DIR, options.cardType === "event" ? "events" : "stages"),
);
const runtimeModule = (await import(
  `${pathToFileURL(join(PACKAGE_DIR, "../../packages/cards/src/index.ts")).href}?inventory=${Date.now()}`
)) as { allCards: readonly InventoryCard[] };
const exportedIds = new Set(
  runtimeModule.allCards
    .filter((card) => card.cardType === options.cardType)
    .map((card) => card.id),
);
const entries: InventoryEntry[] = [];

for (const file of definitionFiles(options.cardType)) {
  for (const card of await loadCards(file, options.cardType)) {
    const storedSet = card.setId;
    if (options.set && storedSet !== options.set) continue;
    const text = printedText(card);
    const generated = text ? buildCardEffects(text) : undefined;
    entries.push({
      storedSet,
      id: card.id,
      canonicalId: card.canonicalId,
      name: card.name,
      file: relative(PACKAGE_DIR, file),
      exported: exportedIds.has(card.id),
      printedText: Boolean(text),
      structuredEffects: Boolean(card.effects),
      behaviorTest: hasBehaviorTest(tests, card),
      auditStatus: auditStatus(text, generated, card.effects),
    });
  }
}

entries.sort(
  (left, right) =>
    left.storedSet.localeCompare(right.storedSet, undefined, { numeric: true }) ||
    left.id.localeCompare(right.id, undefined, { numeric: true }) ||
    left.file.localeCompare(right.file),
);

const totals = {
  all: entries.length,
  pass: entries.filter((card) => card.auditStatus === "pass").length,
  mismatch: entries.filter((card) => card.auditStatus === "mismatch").length,
  vanilla: entries.filter((card) => card.auditStatus === "vanilla").length,
  exported: entries.filter((card) => card.exported).length,
  behavior: new Set(entries.filter((card) => card.behaviorTest).map((card) => card.canonicalId))
    .size,
  canonical: new Set(entries.map((card) => card.canonicalId)).size,
};

for (const storedSet of new Set(entries.map((card) => card.storedSet))) {
  const setEntries = entries.filter((card) => card.storedSet === storedSet);
  console.log(
    [
      storedSet,
      `all=${setEntries.length}`,
      `pass=${setEntries.filter((card) => card.auditStatus === "pass").length}`,
      `mismatch=${setEntries.filter((card) => card.auditStatus === "mismatch").length}`,
      `exported=${setEntries.filter((card) => card.exported).length}`,
      `behavior=${new Set(setEntries.filter((card) => card.behaviorTest).map((card) => card.canonicalId)).size}`,
    ].join(" "),
  );
  for (const card of setEntries.filter(
    (entry) => entry.auditStatus === "mismatch" || !entry.exported || !entry.behaviorTest,
  )) {
    console.log(
      `  ${card.id} ${card.auditStatus}${card.exported ? "" : " not-exported"}${card.behaviorTest ? "" : " no-behavior-test"} ${card.file}`,
    );
  }
}

console.log(
  [
    "TOTAL",
    `all=${totals.all}`,
    `canonical=${totals.canonical}`,
    `pass=${totals.pass}`,
    `mismatch=${totals.mismatch}`,
    `vanilla=${totals.vanilla}`,
    `exported=${totals.exported}`,
    `behavior=${totals.behavior}`,
  ].join(" "),
);

if (options.write) {
  if (options.set) throw new Error("--write requires the complete inventory; omit --set.");
  const output = join(
    PACKAGE_DIR,
    options.cardType === "event" ? "EVENT_INVENTORY.md" : "STAGE_INVENTORY.md",
  );
  writeFileSync(output, renderMarkdown(options.cardType, entries));
  console.log(`wrote ${output}`);
}

if (totals.mismatch > 0 || totals.exported !== totals.all) process.exitCode = 1;
