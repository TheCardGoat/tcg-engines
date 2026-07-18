import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { CardEffects, EventCard, StageCard } from "@tcg/op-types";
import { buildCardEffects } from "../src/effect-parser/index.ts";

type AuditedCard = EventCard | StageCard;
type AuditedType = AuditedCard["cardType"];

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = join(__dirname, "../../../packages/cards/src/cards");

interface CliOptions {
  cardType: AuditedType;
  cardId: string;
  write: boolean;
}

function usage(): never {
  console.error("Usage: vp run audit:<event|stage> -- <CARD_ID> [--write]");
  console.error("Example: vp run audit:event -- OP01-029");
  process.exit(2);
}

function parseArgs(args: string[]): CliOptions {
  const requestedType = args[0];
  if (requestedType !== "event" && requestedType !== "stage") usage();
  const write = args.includes("--write");
  const positional = args.slice(1).filter((arg) => !arg.startsWith("--"));
  const requestedCardId = positional[0];
  const [baseId, ...suffix] = requestedCardId?.split("_") ?? [];
  const cardId = baseId ? [baseId.toUpperCase(), ...suffix].join("_") : undefined;
  if (!cardId || positional.length !== 1) usage();
  return { cardType: requestedType, cardId, write };
}

function definitionFiles(cardType: AuditedType): string[] {
  const plural = cardType === "event" ? "events" : "stages";
  const files: string[] = [];
  for (const setEntry of readdirSync(CARDS_DIR, { withFileTypes: true })) {
    if (!setEntry.isDirectory()) continue;
    const setDirectory = join(CARDS_DIR, setEntry.name);
    const directory = join(setDirectory, plural);
    if (existsSync(directory)) {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (
          entry.isFile() &&
          entry.name.endsWith(".ts") &&
          !entry.name.endsWith(".i18n.ts") &&
          entry.name !== "index.ts"
        ) {
          files.push(join(directory, entry.name));
        }
      }
    }
    const legacyIndex = join(setDirectory, "index.ts");
    if (
      existsSync(legacyIndex) &&
      readFileSync(legacyIndex, "utf8").includes(`cardType: "${cardType}"`)
    ) {
      files.push(legacyIndex);
    }
  }
  return files;
}

function findCardFile(cardType: AuditedType, cardId: string): string {
  const idLine = `  id: ${JSON.stringify(cardId)},`;
  const matches = definitionFiles(cardType).filter((file) =>
    readFileSync(file, "utf8").includes(idLine),
  );
  if (matches.length === 0) {
    throw new Error(`No ${cardType} definition found for ${cardId}.`);
  }
  if (matches.length > 1) {
    throw new Error(`Multiple ${cardType} definitions found for ${cardId}:\n${matches.join("\n")}`);
  }
  return matches[0]!;
}

async function loadCard(file: string, cardType: AuditedType, cardId: string): Promise<AuditedCard> {
  const module = (await import(`${pathToFileURL(file).href}?audit=${Date.now()}`)) as Record<
    string,
    unknown
  >;
  const card = Object.values(module).find(
    (value): value is AuditedCard =>
      typeof value === "object" &&
      value !== null &&
      "cardType" in value &&
      value.cardType === cardType &&
      "id" in value &&
      value.id === cardId,
  );
  if (!card) {
    throw new Error(`The module at ${file} does not export ${cardType} ${cardId}.`);
  }
  return card;
}

function printedText(card: AuditedCard): string {
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

function renderEffects(effects: CardEffects): string {
  const json = JSON.stringify(effects, null, 2).replace(/"(\w+)":/g, "$1:");
  const lines = json.split("\n").map((line) => `  ${line}`);
  lines[0] = "  effects: {";
  lines[lines.length - 1] = "  },";
  return lines.join("\n");
}

function replaceEffects(file: string, cardId: string, effects: CardEffects | undefined): void {
  const source = readFileSync(file, "utf8");
  if (file.endsWith("/index.ts")) {
    throw new Error(
      `--write is not supported for bundled legacy definitions (${cardId} in ${file}).`,
    );
  }
  const existingPattern = /\n  effects: \{[\s\S]*?\n  \},\n(?=  i18n:)/;
  const existing = existingPattern.test(source);
  let next = source;
  if (effects && existing) {
    next = source.replace(existingPattern, `\n${renderEffects(effects)}\n`);
  } else if (effects) {
    next = source.replace(/\n(?=  i18n:)/, `\n${renderEffects(effects)}\n`);
  } else if (existing) {
    next = source.replace(existingPattern, "\n");
  }
  if (next === source) throw new Error(`Could not update the effects block in ${file}.`);
  writeFileSync(file, next);
}

const options = parseArgs(process.argv.slice(2));
const file = findCardFile(options.cardType, options.cardId);
const card = await loadCard(file, options.cardType, options.cardId);
const text = printedText(card);
const generated = text ? buildCardEffects(text) : undefined;

console.log(`${options.cardId} ${card.name}`);
console.log(`definition: ${file}`);
console.log(`printed text: ${JSON.stringify(text)}`);

if (stable(generated) === stable(card.effects)) {
  console.log(text ? "structured effects: PASS" : "structured effects: PASS (vanilla)");
  process.exit(0);
}

console.log("structured effects: MISMATCH");
console.log(`current: ${JSON.stringify(card.effects ?? null, null, 2)}`);
console.log(`generated: ${JSON.stringify(generated ?? null, null, 2)}`);

if (!options.write) {
  process.exitCode = 1;
} else {
  replaceEffects(file, options.cardId, generated);
  console.log(`updated: ${file}`);
}
