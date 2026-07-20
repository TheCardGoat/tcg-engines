import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { CardEffects, CharacterCard } from "@tcg/op-types";
import { buildCardEffects } from "../src/effect-parser/index.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIR = join(__dirname, "..");
const CARDS_DIR = join(PACKAGE_DIR, "../../packages/cards/src/cards");
const ENGINE_BEHAVIOR_TESTS_DIR = join(PACKAGE_DIR, "../../packages/engine/tests/cards");
const ENGINE_AUTHORED_CARD_TESTS_DIR = join(PACKAGE_DIR, "../../packages/engine/src/cards");
const MARKDOWN_OUTPUT = join(PACKAGE_DIR, "CHARACTER_INVENTORY.md");

type AuditStatus = "mismatch" | "pass" | "vanilla";

interface CliOptions {
  set?: string;
  write: boolean;
}

interface CharacterInventoryEntry {
  storedSet: string;
  canonicalSet: string;
  id: string;
  canonicalId: string;
  name: string;
  slug: string;
  file: string;
  exported: boolean;
  printedText: boolean;
  triggerText: boolean;
  structuredEffects: boolean;
  behaviorTest: boolean;
  auditStatus: AuditStatus;
}

interface SetInventory {
  storedSet: string;
  characters: CharacterInventoryEntry[];
  totals: {
    all: number;
    vanilla: number;
    withText: number;
    pass: number;
    mismatch: number;
    exported: number;
    behaviorTests: number;
  };
}

interface CharacterInventory {
  totals: SetInventory["totals"] & {
    sets: number;
  };
  sets: SetInventory[];
}

interface BehaviorTestSource {
  file: string;
  source: string;
}

function usage(): never {
  console.error("Usage: vp run inventory:characters -- [--set <STORED_SET>] [--write]");
  console.error("Example: vp run inventory:characters -- --set OP01");
  process.exit(2);
}

function parseArgs(args: string[]): CliOptions {
  let set: string | undefined;
  let write = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === "--") {
      continue;
    }
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

  return { set, write };
}

function stable(value: unknown): string {
  return JSON.stringify(value ?? null);
}

function storedSetDirectories(): string[] {
  return readdirSync(CARDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(CARDS_DIR, entry.name, "characters")))
    .map((entry) => entry.name)
    .sort();
}

function characterFiles(storedSet: string): string[] {
  const directory = join(CARDS_DIR, storedSet, "characters");
  return readdirSync(directory, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".i18n.ts") &&
        entry.name !== "index.ts",
    )
    .map((entry) => join(directory, entry.name))
    .sort();
}

function allTestSources(directory: string): BehaviorTestSource[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return allTestSources(path);
    return entry.isFile() && entry.name.endsWith(".test.ts")
      ? [{ file: path, source: readFileSync(path, "utf8") }]
      : [];
  });
}

async function loadCard(file: string): Promise<CharacterCard> {
  const module = (await import(`${pathToFileURL(file).href}?inventory=${Date.now()}`)) as Record<
    string,
    unknown
  >;
  const cards = Object.values(module).filter(
    (value): value is CharacterCard =>
      typeof value === "object" &&
      value !== null &&
      "cardType" in value &&
      value.cardType === "character",
  );
  if (cards.length !== 1) {
    throw new Error(`${file} must export exactly one Character definition; found ${cards.length}.`);
  }
  return cards[0]!;
}

function printedText(card: CharacterCard): string {
  const storedEffectText = card.effect ?? card.i18n.en.effect;
  const trimmedEffectText = storedEffectText?.trim();
  const effectText =
    trimmedEffectText && !/^(?:NULL|-)$/i.test(trimmedEffectText) ? trimmedEffectText : undefined;
  const triggerText =
    card.trigger && !/(?:^|\n)\s*\[Trigger\]/i.test(effectText ?? "")
      ? `[Trigger] ${card.trigger}`
      : undefined;
  return [effectText, triggerText]
    .filter((text): text is string => Boolean(text?.trim()))
    .join("\n");
}

function auditStatus(
  text: string,
  generated: CardEffects | undefined,
  checkedIn: CardEffects | undefined,
): AuditStatus {
  if (!text) {
    return checkedIn ? "mismatch" : "vanilla";
  }
  if (!generated) return "mismatch";
  return stable(generated) === stable(checkedIn) ? "pass" : "mismatch";
}

function hasOwnedBehaviorTest(
  tests: BehaviorTestSource[],
  storedSet: string,
  cardId: string,
  canonicalId: string,
  definitionFile: string,
  importFragment: string,
): boolean {
  const definitionStem = definitionFile.replace(/\.ts$/, "");
  return tests.some((test) => {
    const relativeTest = relative(ENGINE_BEHAVIOR_TESTS_DIR, test.file).replaceAll("\\", "/");
    const parts = relativeTest.split("/");
    const testSet = parts[0];
    const testFile = parts.at(-1);
    const testStem = testFile?.replace(/\.test\.ts$/, "");
    const legacyOwnedTest =
      testSet === storedSet &&
      Boolean(testStem) &&
      definitionStem === testStem &&
      test.source.includes(importFragment);
    const authoredCharacterTest =
      testSet === "characters" &&
      testStem !== undefined &&
      (testStem.toLowerCase() === `${storedSet}-${definitionStem}`.toLowerCase() ||
        testStem.toLowerCase().startsWith(`${canonicalId.toLowerCase()}-`)) &&
      test.source.includes(cardId);
    const relativeAuthoredTest = relative(ENGINE_AUTHORED_CARD_TESTS_DIR, test.file).replaceAll(
      "\\",
      "/",
    );
    const authoredParts = relativeAuthoredTest.split("/");
    const authoredOwnedTest =
      authoredParts[0] === storedSet &&
      authoredParts[1] === "characters" &&
      authoredParts.at(-1)?.replace(/\.test\.ts$/, "") === definitionStem &&
      test.source.includes(importFragment) &&
      test.source.includes("OnePieceTestEngine") &&
      !test.source.includes("validateCardAbility");
    return legacyOwnedTest || authoredCharacterTest || authoredOwnedTest;
  });
}

function canonicalSet(card: CharacterCard): string {
  return card.canonicalId.split("-")[0] ?? card.setId;
}

function setTotals(characters: CharacterInventoryEntry[]): SetInventory["totals"] {
  return {
    all: characters.length,
    vanilla: characters.filter((card) => card.auditStatus === "vanilla").length,
    withText: characters.filter((card) => card.printedText || card.triggerText).length,
    pass: characters.filter((card) => card.auditStatus === "pass").length,
    mismatch: characters.filter((card) => card.auditStatus === "mismatch").length,
    exported: characters.filter((card) => card.exported).length,
    behaviorTests: characters.filter((card) => card.behaviorTest).length,
  };
}

function renderMarkdown(inventory: CharacterInventory): string {
  const lines = [
    "# One Piece Character Inventory",
    "",
    "Generated by `vp run inventory:characters -- --write`. Do not edit by hand.",
    "",
    "A parser `pass` means the checked-in structured effects exactly match a fresh",
    "transformation of the stored English printed text. It does not replace",
    "semantic review or command-driven behavior proof.",
    "",
    `- Stored sets: ${inventory.totals.sets}`,
    `- Character definitions: ${inventory.totals.all}`,
    `- Characters with printed ability text: ${inventory.totals.withText}`,
    `- Vanilla Characters: ${inventory.totals.vanilla}`,
    `- Exact parser transformations: ${inventory.totals.pass}`,
    `- Parser mismatches: ${inventory.totals.mismatch}`,
    `- Exported definitions: ${inventory.totals.exported}`,
    `- Definitions with command-driven behavior tests: ${inventory.totals.behaviorTests}`,
    "",
    "## Set Summary",
    "",
    "<!-- prettier-ignore -->",
    "| Stored set | Characters | Text | Vanilla | Pass | Mismatch | Exported | Behavior tests |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const set of inventory.sets) {
    const totals = set.totals;
    lines.push(
      `| ${set.storedSet} | ${totals.all} | ${totals.withText} | ${totals.vanilla} | ${totals.pass} | ${totals.mismatch} | ${totals.exported} | ${totals.behaviorTests} |`,
    );
  }

  for (const set of inventory.sets) {
    lines.push(
      "",
      `## ${set.storedSet}`,
      "",
      "<!-- prettier-ignore -->",
      "| ID | Canonical ID | Name | Text | Structured | Audit | Exported | Behavior test | Definition |",
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    );
    for (const card of set.characters) {
      const definition = card.file.replaceAll("\\", "/");
      lines.push(
        `| ${card.id} | ${card.canonicalId} | ${card.name.replaceAll("|", "\\|")} | ${card.printedText || card.triggerText ? "yes" : "no"} | ${card.structuredEffects ? "yes" : "no"} | ${card.auditStatus} | ${card.exported ? "yes" : "no"} | ${card.behaviorTest ? "yes" : "no"} | \`${definition}\` |`,
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

const options = parseArgs(process.argv.slice(2));
const availableSets = storedSetDirectories();
const selectedSets = options.set
  ? availableSets.filter((storedSet) => storedSet === options.set)
  : availableSets;

if (selectedSets.length === 0) {
  throw new Error(`Unknown stored set ${options.set}. Available sets: ${availableSets.join(", ")}`);
}

const behaviorTestSources = [
  ...allTestSources(ENGINE_BEHAVIOR_TESTS_DIR),
  ...allTestSources(ENGINE_AUTHORED_CARD_TESTS_DIR),
];
const sets: SetInventory[] = [];

for (const storedSet of selectedSets) {
  const indexSource = readFileSync(join(CARDS_DIR, storedSet, "characters", "index.ts"), "utf8");
  const characters: CharacterInventoryEntry[] = [];

  for (const file of characterFiles(storedSet)) {
    const card = await loadCard(file);
    const text = printedText(card);
    const generated = text ? buildCardEffects(text) : undefined;
    const basename = file.slice(file.lastIndexOf("/") + 1);
    const definitionStem = basename.replace(/\.ts$/, "");
    const importFragment = `cards/src/cards/${storedSet}/characters/${basename}`.replaceAll(
      "\\",
      "/",
    );

    characters.push({
      storedSet,
      canonicalSet: canonicalSet(card),
      id: card.id,
      canonicalId: card.canonicalId,
      name: card.name,
      slug: card.slug,
      file: relative(PACKAGE_DIR, file),
      exported: indexSource.includes(`"./${basename}"`),
      printedText: Boolean(printedText(card)),
      triggerText: Boolean(card.trigger?.trim()),
      structuredEffects: Boolean(card.effects),
      behaviorTest: hasOwnedBehaviorTest(
        behaviorTestSources,
        storedSet,
        card.id,
        card.canonicalId,
        definitionStem,
        importFragment,
      ),
      auditStatus: auditStatus(text, generated, card.effects),
    });
  }

  characters.sort(
    (left, right) =>
      left.id.localeCompare(right.id, undefined, { numeric: true }) ||
      left.file.localeCompare(right.file),
  );
  sets.push({
    storedSet,
    characters,
    totals: setTotals(characters),
  });
}

const allCharacters = sets.flatMap((set) => set.characters);
const totals = setTotals(allCharacters);
const inventory: CharacterInventory = {
  totals: {
    sets: sets.length,
    ...totals,
  },
  sets,
};

for (const set of sets) {
  const totals = set.totals;
  console.log(
    [
      set.storedSet,
      `all=${totals.all}`,
      `text=${totals.withText}`,
      `vanilla=${totals.vanilla}`,
      `pass=${totals.pass}`,
      `mismatch=${totals.mismatch}`,
      `exported=${totals.exported}`,
      `behavior=${totals.behaviorTests}`,
    ].join(" "),
  );
  for (const card of set.characters.filter(
    (entry) => entry.auditStatus === "mismatch" || !entry.exported,
  )) {
    console.log(
      `  ${card.id} ${card.auditStatus}${card.exported ? "" : " not-exported"} ${card.file}`,
    );
  }
}

console.log(
  [
    "TOTAL",
    `sets=${inventory.totals.sets}`,
    `all=${inventory.totals.all}`,
    `text=${inventory.totals.withText}`,
    `vanilla=${inventory.totals.vanilla}`,
    `pass=${inventory.totals.pass}`,
    `mismatch=${inventory.totals.mismatch}`,
    `exported=${inventory.totals.exported}`,
    `behavior=${inventory.totals.behaviorTests}`,
  ].join(" "),
);

if (options.write) {
  if (options.set) {
    throw new Error("--write requires the complete inventory; omit --set.");
  }
  writeFileSync(MARKDOWN_OUTPUT, renderMarkdown(inventory));
  console.log(`wrote ${MARKDOWN_OUTPUT}`);
}

if (inventory.totals.mismatch > 0 || inventory.totals.exported !== inventory.totals.all) {
  process.exitCode = 1;
}
