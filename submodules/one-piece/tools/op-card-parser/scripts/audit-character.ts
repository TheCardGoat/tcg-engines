import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Action, CardEffects, CharacterCard } from "@tcg/op-types";
import { buildCardEffects } from "../src/effect-parser/index.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = join(__dirname, "../../../packages/cards/src/cards");

interface CliOptions {
  cardId: string;
  write: boolean;
}

function usage(): never {
  console.error("Usage: vp run audit:character -- <CARD_ID> [--write]");
  console.error("Example: vp run audit:character -- OP14-003");
  process.exit(2);
}

function parseArgs(args: string[]): CliOptions {
  const write = args.includes("--write");
  const positional = args.filter((arg) => !arg.startsWith("--"));
  const requestedCardId = positional[0];
  const [baseId, ...suffix] = requestedCardId?.split("_") ?? [];
  const cardId = baseId ? [baseId.toUpperCase(), ...suffix].join("_") : undefined;
  if (!cardId || positional.length !== 1) usage();
  return { cardId, write };
}

function characterFiles(): string[] {
  const files: string[] = [];
  for (const setEntry of readdirSync(CARDS_DIR, { withFileTypes: true })) {
    if (!setEntry.isDirectory()) continue;
    const legacyIndex = join(CARDS_DIR, setEntry.name, "index.ts");
    if (existsSync(legacyIndex)) files.push(legacyIndex);
    const directory = join(CARDS_DIR, setEntry.name, "characters");
    if (!existsSync(directory)) continue;
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
  return files;
}

function findCardFile(cardId: string): string {
  const idLine = `  id: ${JSON.stringify(cardId)},`;
  const matches = characterFiles().filter((file) => readFileSync(file, "utf8").includes(idLine));
  if (matches.length === 0) throw new Error(`No Character definition found for ${cardId}.`);
  if (matches.length > 1) {
    throw new Error(`Multiple Character definitions found for ${cardId}:\n${matches.join("\n")}`);
  }
  return matches[0]!;
}

async function loadCard(file: string, cardId: string): Promise<CharacterCard> {
  const module = (await import(`${pathToFileURL(file).href}?audit=${Date.now()}`)) as Record<
    string,
    unknown
  >;
  const card = Object.values(module).find(
    (value): value is CharacterCard =>
      typeof value === "object" &&
      value !== null &&
      "cardType" in value &&
      value.cardType === "character" &&
      "id" in value &&
      value.id === cardId,
  );
  if (!card) throw new Error(`The module at ${file} does not export Character ${cardId}.`);
  return card;
}

function stable(value: unknown): string {
  return JSON.stringify(value ?? null);
}

function flattenActions(actions: Action[]): Action[] {
  return actions.flatMap((action) => {
    let nested: Action[] = [];
    switch (action.action) {
      case "delayed":
        nested = action.actions;
        break;
      case "choice":
        nested = action.options.flat();
        break;
      case "removeFromLife":
      case "returnDon":
        nested = action.thenActions ?? [];
        break;
      case "revealFromDeck":
        nested = action.ifRevealedCardMatches?.actions ?? [];
        break;
      case "revealFromLife":
        nested = action.conditionalPlay?.thenActions ?? [];
        break;
    }
    return [action, ...flattenActions(nested)];
  });
}

function renderEffects(effects: CardEffects): string {
  const json = JSON.stringify(effects, null, 2).replace(/"(\w+)":/g, "$1:");
  const lines = json.split("\n").map((line) => `  ${line}`);
  lines[0] = "  effects: {";
  lines[lines.length - 1] = "  },";
  return lines.join("\n");
}

function replaceEffects(file: string, effects: CardEffects | undefined): void {
  const source = readFileSync(file, "utf8");
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
const file = findCardFile(options.cardId);
const card = await loadCard(file, options.cardId);
const storedEffectText = card.effect ?? card.i18n.en.effect;
const trimmedEffectText = storedEffectText?.trim();
const effectText =
  trimmedEffectText && !/^(?:NULL|-)$/i.test(trimmedEffectText) ? trimmedEffectText : undefined;
const triggerText =
  card.trigger && !/(?:^|\n)\s*\[Trigger\]/i.test(effectText ?? "")
    ? `[Trigger] ${card.trigger}`
    : undefined;
const printedText = [effectText, triggerText]
  .filter((text): text is string => Boolean(text))
  .join("\n");

if (
  options.cardId === "OP14-009" &&
  stable(card.traits) !== stable(["Heart Pirates Supernovas The Seven Warlords of the Sea"])
) {
  throw new Error(
    "OP14-009 official metadata requires Heart Pirates, Supernovas, and The Seven Warlords of the Sea traits.",
  );
}
if (
  options.cardId === "OP14-016" &&
  (card.name !== "X.Drake" ||
    card.slug !== "x-drake/op14-016" ||
    stable(card.traits) !== stable(["Supernovas", "Navy", "Drake Pirates"]))
) {
  throw new Error(
    "OP14-016 official metadata requires its canonical name/slug and separate Supernovas/Navy/Drake Pirates traits.",
  );
}
if (
  options.cardId === "OP14-021" &&
  (card.name !== "Issho" ||
    card.slug !== "issho/op14-021" ||
    stable(card.traits) !== stable(["Dressrosa", "Navy"]))
) {
  throw new Error(
    "OP14-021 official metadata requires its canonical name/slug and separate Dressrosa/Navy traits.",
  );
}
if (
  options.cardId === "OP14-022" &&
  (card.name !== "Usopp" ||
    card.slug !== "usopp/op14-022" ||
    stable(card.traits) !== stable(["FILM", "Straw Hat Crew"]))
) {
  throw new Error(
    "OP14-022 official metadata requires its canonical name/slug and separate FILM/Straw Hat Crew traits.",
  );
}

if (
  options.cardId === "OP14-055" &&
  (card.name !== "The Macro Gang" ||
    card.slug !== "the-macro-gang/op14-055" ||
    card.cost !== 5 ||
    card.power !== 6000 ||
    card.counter !== 2000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "blue" ||
    !card.traits?.includes("Fish-Man") ||
    !card.traits.includes("The Sun Pirates") ||
    card.traits.length !== 2)
) {
  throw new Error(
    "OP14-055 official metadata requires its canonical slug, blue color, 5 cost, 6000 power, 2000 counter, Strike attribute, and separate Fish-Man/The Sun Pirates traits.",
  );
}
if (
  options.cardId === "OP14-056" &&
  (card.name !== "Wadatsumi" ||
    card.slug !== "wadatsumi/op14-056" ||
    card.cost !== 3 ||
    card.power !== 5000 ||
    card.counter !== 2000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "blue" ||
    !card.traits?.includes("Fish-Man") ||
    !card.traits.includes("The Sun Pirates") ||
    card.traits.length !== 2)
) {
  throw new Error(
    "OP14-056 official metadata requires blue, 3 cost, 5000 power, 2000 counter, Strike, and separate Fish-Man/The Sun Pirates traits.",
  );
}
if (
  options.cardId === "OP14-061" &&
  (card.name !== "Vergo" ||
    card.slug !== "vergo/op14-061" ||
    card.cost !== 5 ||
    card.power !== 7000 ||
    card.counter !== undefined ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    !card.traits?.includes("Punk Hazard") ||
    !card.traits.includes("Navy") ||
    !card.traits.includes("Donquixote Pirates") ||
    card.traits.length !== 3)
) {
  throw new Error(
    "OP14-061 official metadata requires purple, 5 cost, 7000 power, no counter, Strike, and separate Punk Hazard/Navy/Donquixote Pirates traits.",
  );
}
if (
  options.cardId === "OP14-062" &&
  (card.name !== "Gladius" ||
    card.slug !== "gladius/op14-062" ||
    card.cost !== 3 ||
    card.power !== 4000 ||
    card.counter !== 1000 ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-062 official metadata requires purple, 3 cost, 4000 power, 1000 counter, Special, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-063" &&
  (card.name !== "Sugar" ||
    card.slug !== "sugar/op14-063" ||
    card.cost !== 4 ||
    card.power !== 1000 ||
    card.counter !== 1000 ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-063 official metadata requires purple, 4 cost, 1000 power, 1000 counter, Special, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-064" &&
  (card.name !== "Giolla" ||
    card.slug !== "giolla/op14-064" ||
    card.cost !== 3 ||
    card.power !== 1000 ||
    card.counter !== 1000 ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-064 official metadata requires purple, 3 cost, 1000 power, 1000 counter, Special, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-065" &&
  (card.name !== "Senor Pink" ||
    card.slug !== "senor-pink/op14-065" ||
    card.cost !== 4 ||
    card.power !== 5000 ||
    card.counter !== 1000 ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-065 official metadata requires purple, 4 cost, 5000 power, 1000 counter, Special, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-066" &&
  (card.name !== "Diamante" ||
    card.slug !== "diamante/op14-066" ||
    card.cost !== 6 ||
    card.power !== 8000 ||
    card.counter !== 1000 ||
    card.attribute !== "slash" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-066 official metadata requires purple, 6 cost, 8000 power, 1000 counter, Slash, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-067" &&
  (card.name !== "Dellinger" ||
    card.slug !== "dellinger/op14-067" ||
    card.cost !== 1 ||
    card.power !== 2000 ||
    card.counter !== 1000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-067 official metadata requires purple, 1 cost, 2000 power, 1000 counter, Strike, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-068" &&
  (card.name !== "Trebol" ||
    card.slug !== "trebol/op14-068" ||
    card.cost !== 5 ||
    card.power !== 5000 ||
    card.counter !== 2000 ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-068 official metadata requires purple, 5 cost, 5000 power, 2000 counter, Special, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-069" &&
  (card.name !== "Donquixote Doflamingo" ||
    card.slug !== "donquixote-doflamingo/op14-069" ||
    card.cost !== 10 ||
    card.power !== 10000 ||
    card.counter !== undefined ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    !card.traits?.includes("The Seven Warlords of the Sea") ||
    !card.traits.includes("Donquixote Pirates") ||
    card.traits.length !== 2)
) {
  throw new Error(
    "OP14-069 official metadata requires purple, 10 cost, 10000 power, no counter, Special, and separate Seven Warlords/Donquixote Pirates traits.",
  );
}
if (
  options.cardId === "OP14-070" &&
  (card.name !== "Buffalo" ||
    card.slug !== "buffalo/op14-070" ||
    card.cost !== 2 ||
    card.power !== 1000 ||
    card.counter !== 1000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-070 official metadata requires purple, 2 cost, 1000 power, 1000 counter, Strike, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-071" &&
  (card.name !== "Pica" ||
    card.slug !== "pica/op14-071" ||
    card.cost !== 5 ||
    card.power !== 6000 ||
    card.counter !== 1000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-071 official metadata requires purple, 5 cost, 6000 power, 1000 counter, Strike, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-072" &&
  (card.name !== "Baby 5" ||
    card.slug !== "baby-5/op14-072" ||
    card.cost !== 4 ||
    card.power !== 1000 ||
    card.counter !== 1000 ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-072 official metadata requires purple, 4 cost, 1000 power, 1000 counter, Special, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-073" &&
  (card.name !== "Machvise" ||
    card.slug !== "machvise/op14-073" ||
    card.cost !== 6 ||
    card.power !== 7000 ||
    card.counter !== 2000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-073 official metadata requires purple, 6 cost, 7000 power, 2000 counter, Strike, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-074" &&
  (card.name !== "Monet" ||
    card.slug !== "monet/op14-074" ||
    card.cost !== 5 ||
    card.power !== 6000 ||
    card.counter !== 1000 ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 2 ||
    !card.traits.includes("Punk Hazard") ||
    !card.traits.includes("Donquixote Pirates"))
) {
  throw new Error(
    "OP14-074 official metadata requires purple, 5 cost, 6000 power, 1000 counter, Special, and separate Punk Hazard/Donquixote Pirates traits.",
  );
}
if (
  options.cardId === "OP14-075" &&
  (card.name !== "Lao.G" ||
    card.slug !== "lao-g/op14-075" ||
    card.cost !== 3 ||
    card.power !== 4000 ||
    card.counter !== 1000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "purple" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Donquixote Pirates")
) {
  throw new Error(
    "OP14-075 official metadata requires purple, 3 cost, 4000 power, 1000 counter, Strike, and Donquixote Pirates.",
  );
}
if (
  options.cardId === "OP14-081" &&
  (card.name !== "Spider Mice" ||
    card.slug !== "spider-mice/op14-081" ||
    card.cost !== 1 ||
    card.power !== 1000 ||
    card.counter !== 1000 ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Thriller Bark Pirates")
) {
  throw new Error(
    "OP14-081 official metadata requires black, 1 cost, 1000 power, 1000 counter, Special, and Thriller Bark Pirates.",
  );
}
if (
  options.cardId === "OP14-082" &&
  (card.name !== "Oinkchuck" ||
    card.slug !== "oinkchuck/op14-082" ||
    card.cost !== 2 ||
    card.power !== 3000 ||
    card.counter !== 1000 ||
    card.attribute !== "slash" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Thriller Bark Pirates" ||
    card.trigger !==
      "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 2 or less from your trash rested.")
) {
  throw new Error(
    "OP14-082 official metadata requires black, 2 cost, 3000 power, 1000 counter, Slash, Thriller Bark Pirates, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-083" &&
  (card.name !== "Ms. Wednesday" ||
    card.slug !== "ms-wednesday/op14-083" ||
    card.cost !== 1 ||
    card.power !== 1000 ||
    card.counter !== 2000 ||
    card.attribute !== "slash" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-083 official metadata requires black, 1 cost, 1000 power, 2000 counter, Slash, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-084" &&
  (card.name !== "Ms. All Sunday" ||
    card.slug !== "ms-all-sunday/op14-084" ||
    card.cost !== 7 ||
    card.power !== 8000 ||
    card.counter !== undefined ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-084 official metadata requires black, 7 cost, 8000 power, no counter, Strike, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-085" &&
  (card.name !== "Miss.Goldenweek(Marianne)" ||
    card.slug !== "miss-goldenweek-marianne/op14-085" ||
    card.cost !== 1 ||
    card.power !== 2000 ||
    card.counter !== 2000 ||
    card.attribute !== "wisdom" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-085 official metadata requires black, 1 cost, 2000 power, 2000 counter, Wisdom, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-086" &&
  (card.name !== "Miss Doublefinger(Zala)" ||
    card.slug !== "miss-doublefinger-zala/op14-086" ||
    card.cost !== 5 ||
    card.power !== 6000 ||
    card.counter !== 1000 ||
    card.attribute !== "slash" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-086 official metadata requires black, 5 cost, 6000 power, 1000 counter, Slash, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-087" &&
  (card.name !== "Miss.Valentine(Mikita)" ||
    card.slug !== "miss-valentine-mikita/op14-087" ||
    card.cost !== 1 ||
    card.power !== 2000 ||
    card.counter !== 1000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-087 official metadata requires black, 1 cost, 2000 power, 1000 counter, Strike, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-088" &&
  (card.name !== "Miss.MerryChristmas(Drophy)" ||
    card.slug !== "miss-merrychristmas-drophy/op14-088" ||
    card.cost !== 1 ||
    card.power !== 2000 ||
    card.counter !== 2000 ||
    card.attribute !== "slash" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-088 official metadata requires black, 1 cost, 2000 power, 2000 counter, Slash, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-089" &&
  (card.name !== "Ryuma" ||
    card.slug !== "ryuma/op14-089" ||
    card.cost !== 3 ||
    card.power !== 5000 ||
    card.counter !== undefined ||
    card.attribute !== "slash" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    stable(card.traits) !== stable(["Land of Wano", "Thriller Bark Pirates"]) ||
    card.trigger !==
      "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.")
) {
  throw new Error(
    "OP14-089 official metadata requires black, 3 cost, 5000 power, no counter, Slash, Land of Wano, Thriller Bark Pirates, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-090" &&
  (card.name !== "Mr.1(Daz.Bonez)" ||
    card.slug !== "mr-1-daz-bonez/op14-090" ||
    card.cost !== 5 ||
    card.power !== 6000 ||
    card.counter !== 1000 ||
    card.attribute !== "slash" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-090 official metadata requires black, 5 cost, 6000 power, 1000 counter, Slash, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-091" &&
  (card.name !== "Mr.2.Bon.Kurei(Bentham)" ||
    card.slug !== "mr-2-bon-kurei-bentham/op14-091" ||
    card.cost !== 4 ||
    card.power !== 5000 ||
    card.counter !== 1000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-091 official metadata requires black, 4 cost, 5000 power, 1000 counter, Strike, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-092" &&
  (card.name !== "Mr.3(Galdino)" ||
    card.slug !== "mr-3-galdino/op14-092" ||
    card.cost !== 4 ||
    card.power !== 6000 ||
    card.counter !== undefined ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-092 official metadata requires black, 4 cost, 6000 power, no counter, Special, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-093" &&
  (card.name !== "Mr.4(Babe)" ||
    card.slug !== "mr-4-babe/op14-093" ||
    card.cost !== 4 ||
    card.power !== 5000 ||
    card.counter !== 1000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-093 official metadata requires black, 4 cost, 5000 power, 1000 counter, Strike, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-094" &&
  (card.name !== "Mr.5(Gem)" ||
    card.slug !== "mr-5-gem/op14-094" ||
    card.cost !== 5 ||
    card.power !== 6000 ||
    card.counter !== 1000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-094 official metadata requires black, 5 cost, 6000 power, 1000 counter, Strike, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-095" &&
  (card.name !== "Mr.9" ||
    card.slug !== "mr-9/op14-095" ||
    card.cost !== 5 ||
    card.power !== 6000 ||
    card.counter !== 2000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Baroque Works")
) {
  throw new Error(
    "OP14-095 official metadata requires black, 5 cost, 6000 power, 2000 counter, Strike, and Baroque Works.",
  );
}
if (
  options.cardId === "OP14-100" &&
  (card.name !== "Absalom" ||
    card.slug !== "absalom/op14-100" ||
    card.cost !== 3 ||
    card.power !== 5000 ||
    card.counter !== undefined ||
    card.attribute !== "ranged" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Thriller Bark Pirates" ||
    card.trigger !==
      "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.")
) {
  throw new Error(
    "OP14-100 official metadata requires yellow, 3 cost, 5000 power, no counter, Ranged, Thriller Bark Pirates, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-101" &&
  (card.name !== "Oars" ||
    card.slug !== "oars/op14-101" ||
    card.cost !== 8 ||
    card.power !== 10000 ||
    card.counter !== 1000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    stable(card.traits) !== stable(["Giant", "Thriller Bark Pirates"]))
) {
  throw new Error(
    "OP14-101 official metadata requires yellow, 8 cost, 10000 power, 1000 counter, Strike, and separate Giant/Thriller Bark Pirates traits.",
  );
}
if (
  options.cardId === "OP14-102" &&
  (card.name !== "Kumacy" ||
    card.slug !== "kumacy/op14-102" ||
    card.cost !== 1 ||
    card.power !== 2000 ||
    card.counter !== 2000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Thriller Bark Pirates" ||
    card.trigger !==
      "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.")
) {
  throw new Error(
    "OP14-102 official metadata requires yellow, 1 cost, 2000 power, 2000 counter, Strike, Thriller Bark Pirates, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-103" &&
  (card.name !== "Gloriosa (Grandma Nyon)" ||
    card.slug !== "gloriosa-grandma-nyon/op14-103" ||
    card.cost !== 2 ||
    card.power !== 0 ||
    card.counter !== 1000 ||
    card.attribute !== "wisdom" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Amazon Lily" ||
    card.trigger !== "Play this card.")
) {
  throw new Error(
    "OP14-103 official metadata requires yellow, 2 cost, 0 power, 1000 counter, Wisdom, Amazon Lily, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-104" &&
  (card.name !== "Gecko Moria" ||
    card.slug !== "gecko-moria/op14-104" ||
    card.cost !== 8 ||
    card.power !== 10000 ||
    card.counter !== undefined ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    stable(card.traits) !== stable(["The Seven Warlords of the Sea", "Thriller Bark Pirates"]) ||
    card.trigger !== "Play up to 1 Character card with a cost of 4 or less from your trash.")
) {
  throw new Error(
    "OP14-104 official metadata requires yellow, 8 cost, 10000 power, no counter, Special, separate Seven Warlords/Thriller Bark Pirates traits, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-105" &&
  (card.name !== "Gorgon Sisters" ||
    card.slug !== "gorgon-sisters/op14-105" ||
    card.cost !== 6 ||
    card.power !== 5000 ||
    card.counter !== 2000 ||
    stable(card.attribute) !== stable(["slash", "special"]) ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    stable(card.traits) !== stable(["The Seven Warlords of the Sea", "Kuja Pirates"]) ||
    card.trigger !== "If your Leader has the {Kuja Pirates} type, play this card.")
) {
  throw new Error(
    "OP14-105 official metadata requires yellow, 6 cost, 5000 power, 2000 counter, Slash/Special, separate Seven Warlords/Kuja Pirates traits, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-106" &&
  (card.name !== "Salome" ||
    card.slug !== "salome/op14-106" ||
    card.cost !== 3 ||
    card.power !== 1000 ||
    card.counter !== 1000 ||
    card.attribute !== "strike" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    stable(card.traits) !== stable(["Animal", "Amazon Lily"]) ||
    card.trigger !== "Play this card.")
) {
  throw new Error(
    "OP14-106 official metadata requires yellow, 3 cost, 1000 power, 1000 counter, Strike, separate Animal/Amazon Lily traits, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-107" &&
  (card.name !== "Shakuyaku" ||
    card.slug !== "shakuyaku/op14-107" ||
    card.cost !== 6 ||
    card.power !== 5000 ||
    card.counter !== 2000 ||
    card.attribute !== "wisdom" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Amazon Lily" ||
    card.trigger !== "If your Leader has the {Kuja Pirates} type, play this card.")
) {
  throw new Error(
    "OP14-107 official metadata requires yellow, 6 cost, 5000 power, 2000 counter, Wisdom, Amazon Lily, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-108" &&
  (card.name !== "Silvers Rayleigh" ||
    card.slug !== "silvers-rayleigh/op14-108" ||
    card.cost !== 6 ||
    card.power !== 6000 ||
    card.counter !== 1000 ||
    card.attribute !== "slash" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Former Roger Pirates" ||
    card.trigger !== "Activate this card's [On Play] effect.")
) {
  throw new Error(
    "OP14-108 official metadata requires yellow, 6 cost, 6000 power, 1000 counter, Slash, Former Roger Pirates, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-109" &&
  (card.name !== "Victoria Cindry" ||
    card.slug !== "victoria-cindry/op14-109" ||
    card.cost !== 3 ||
    card.power !== 1000 ||
    card.counter !== 1000 ||
    card.attribute !== "slash" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Thriller Bark Pirates" ||
    card.trigger !==
      "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.")
) {
  throw new Error(
    "OP14-109 official metadata requires yellow, 3 cost, 1000 power, 1000 counter, Slash, Thriller Bark Pirates, Blocker, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-110" &&
  (card.name !== "Dr. Hogback" ||
    card.slug !== "dr-hogback/op14-110" ||
    card.cost !== 4 ||
    card.power !== 5000 ||
    card.counter !== 1000 ||
    card.attribute !== "wisdom" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Thriller Bark Pirates" ||
    card.trigger !==
      "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.")
) {
  throw new Error(
    "OP14-110 official metadata requires yellow, 4 cost, 5000 power, 1000 counter, Wisdom, Thriller Bark Pirates, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-111" &&
  (card.name !== "Perona" ||
    card.slug !== "perona/op14-111" ||
    card.cost !== 4 ||
    card.power !== 5000 ||
    card.counter !== 1000 ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Thriller Bark Pirates" ||
    card.trigger !==
      "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.")
) {
  throw new Error(
    "OP14-111 official metadata requires Perona, yellow, 4 cost, 5000 power, 1000 counter, Special, Thriller Bark Pirates, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-112" &&
  (card.name !== "Boa Hancock" ||
    card.slug !== "boa-hancock/op14-112" ||
    card.cost !== 9 ||
    card.power !== 10000 ||
    card.counter !== undefined ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    stable(card.traits) !== stable(["The Seven Warlords of the Sea", "Kuja Pirates"]) ||
    card.trigger !==
      "Play up to 1 Character card with 6000 power or less and a [Trigger] from your hand.")
) {
  throw new Error(
    "OP14-112 official metadata requires Boa Hancock, yellow, 9 cost, 10000 power, no counter, Special, separate Seven Warlords/Kuja Pirates traits, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-113" &&
  (card.name !== "Marguerite" ||
    card.slug !== "marguerite/op14-113" ||
    card.cost !== 3 ||
    card.power !== 5000 ||
    card.counter !== undefined ||
    card.attribute !== "wisdom" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Amazon Lily" ||
    card.trigger !== "If your Leader has the {Kuja Pirates} type, play this card.")
) {
  throw new Error(
    "OP14-113 official metadata requires yellow, 3 cost, 5000 power, no counter, Wisdom, Amazon Lily, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-114" &&
  (card.name !== "Ran" ||
    card.slug !== "ran/op14-114" ||
    card.cost !== 4 ||
    card.power !== 5000 ||
    card.counter !== 1000 ||
    card.attribute !== "ranged" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Kuja Pirates" ||
    card.trigger !== "If your Leader has the {Kuja Pirates} type, play this card.")
) {
  throw new Error(
    "OP14-114 official metadata requires yellow, 4 cost, 5000 power, 1000 counter, Ranged, Kuja Pirates, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-115" &&
  (card.name !== "Rindo" ||
    card.slug !== "rindo/op14-115" ||
    card.cost !== 5 ||
    card.power !== 5000 ||
    card.counter !== 1000 ||
    card.attribute !== "ranged" ||
    card.color.length !== 1 ||
    card.color[0] !== "yellow" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "Kuja Pirates" ||
    card.trigger !== "If your Leader has the {Kuja Pirates} type, play this card.")
) {
  throw new Error(
    "OP14-115 official metadata requires yellow, 5 cost, 5000 power, 1000 counter, Ranged, Kuja Pirates, and its printed Trigger.",
  );
}
if (
  options.cardId === "OP14-119" &&
  (card.name !== "Dracule Mihawk" ||
    card.slug !== "dracule-mihawk/op14-119" ||
    card.cost !== 9 ||
    card.power !== 10000 ||
    card.counter !== undefined ||
    card.attribute !== "slash" ||
    card.color.length !== 1 ||
    card.color[0] !== "green" ||
    card.traits?.length !== 1 ||
    card.traits[0] !== "The Seven Warlords of the Sea")
) {
  throw new Error(
    "OP14-119 official metadata requires Dracule Mihawk, green, 9 cost, 10000 power, no counter, Slash, and The Seven Warlords of the Sea.",
  );
}
if (
  options.cardId === "OP14-120" &&
  (card.name !== "Crocodile" ||
    card.slug !== "crocodile/op14-120" ||
    card.cost !== 8 ||
    card.power !== 10000 ||
    card.counter !== undefined ||
    card.attribute !== "special" ||
    card.color.length !== 1 ||
    card.color[0] !== "black" ||
    stable(card.traits) !== stable(["The Seven Warlords of the Sea", "Baroque Works"]))
) {
  throw new Error(
    "OP14-120 official metadata requires Crocodile, black, 8 cost, 10000 power, no counter, Special, and separate Seven Warlords/Baroque Works traits.",
  );
}

if (!printedText) {
  if (card.effects) {
    throw new Error(`${options.cardId} has structured effects but no printed effect text.`);
  }
  console.log(`${options.cardId} ${card.name}: PASS (vanilla Character)`);
  process.exit(0);
}

if (card.effect !== card.i18n.en.effect) {
  throw new Error(`${options.cardId} has different card.effect and i18n.en.effect text.`);
}

const generated = buildCardEffects(printedText);
if (!generated) {
  if (!printedText && !card.effects) {
    console.log(`${options.cardId} ${card.name}`);
    console.log(`definition: ${file}`);
    console.log(`printed text: ${JSON.stringify(printedText)}`);
    console.log("structured effects: VANILLA");
    process.exit(0);
  }
  console.error(`${options.cardId} has printed ability text but the parser generated no effects.`);
  process.exit(1);
}

// Equality with the current generated structure is not sufficient: an older
// parser can consistently produce the same semantically wrong sentinel. Keep
// small, independent text-to-action invariants for discrepancies found by the
// card-by-card review.
if (options.cardId === "OP14-063") {
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "active" }],
      },
      {
        trigger: "onKo",
        conditions: [
          { condition: "donFieldCount", player: "opponent", comparison: "gte", value: 6 },
        ],
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "hand" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cost", comparison: "lte", value: 5 },
              { filter: "trait", value: "Donquixote Pirates", match: "includes" },
              { filter: "cardCategory", value: "character" },
            ],
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-063 must preserve optional active DON!! addition and the complete six-DON conditional hand-play semantics.",
    );
  }
}
if (options.cardId === "OP14-064") {
  const expected = {
    effects: [
      {
        trigger: "onKo",
        actions: [
          { action: "addDon", count: { amount: 1, upTo: true }, state: "rested" },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "basePower", comparison: "eq", value: 0 }],
            },
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-064 must preserve optional rested DON!! addition followed by the complete base-power-0 K.O. target.",
    );
  }
}
if (
  options.cardId === "OP14-065" &&
  stable(generated) !==
    stable({
      effects: [
        {
          trigger: "onKo",
          actions: [{ action: "returnDon", player: "opponent", amount: 1 }],
        },
      ],
    })
) {
  throw new Error("OP14-065 must preserve the opponent-owned one-DON!! return action.");
}
if (options.cardId === "OP14-067") {
  const expected = {
    effects: [
      {
        trigger: "onKo",
        actions: [
          { action: "addDon", count: { amount: 1, upTo: true }, state: "rested" },
          {
            action: "search",
            lookCount: 5,
            source: { player: "self", zone: "deck" },
            revealCount: { amount: 1, upTo: true },
            revealFilters: [{ filter: "trait", value: "Donquixote Pirates", match: "includes" }],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-067 must preserve optional rested DON!! addition and the complete filtered top-five search.",
    );
  }
}
if (options.cardId === "OP14-068") {
  const expected = {
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          { condition: "turn", value: "opponent" },
          { condition: "leaderTrait", trait: "Donquixote Pirates", match: "includes" },
        ],
        actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "rested" }],
        oncePerTurn: true,
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-068 must preserve opponent-turn, Leader-trait, once-per-turn, DON-return trigger, and optional rested-DON semantics.",
    );
  }
}
if (options.cardId === "OP14-069") {
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        costs: [{ cost: "returnDon", amount: 3 }],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "ko",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: { amount: 1, upTo: true },
                    filters: [{ filter: "cost", comparison: "lte", value: 8 }],
                  },
                  condition: {
                    condition: "leaderTrait",
                    trait: "Donquixote Pirates",
                    match: "includes",
                  },
                },
              ],
              [
                {
                  action: "cannotBeRested",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: { amount: 3, upTo: true },
                    filters: [{ filter: "cost", comparison: "lte", value: 7 }],
                  },
                  duration: "untilEndOfOpponentNextEndPhase",
                },
              ],
            ],
          },
        ],
        optional: true,
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-069 must preserve its DON!! cost, branch-local Leader condition, complete targets, and opponent-next-End-Phase duration.",
    );
  }
}
if (options.cardId === "OP14-070") {
  const expected = {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenBecomesRested",
        source: "opponentCharacterEffect",
        eventFilter: { targetSelf: true },
        actions: [
          {
            action: "returnDon",
            player: "self",
            amount: 1,
            thenActions: [
              {
                action: "setActive",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: { amount: 1 },
                  self: true,
                },
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-070 must preserve Blocker, opponent-Character-effect causation, optional DON!! return, and dependent self activation.",
    );
  }
}
if (
  options.cardId === "OP14-071" &&
  stable(generated) !==
    stable({
      effects: [
        {
          trigger: "endOfYourTurn",
          conditions: [
            { condition: "leaderTrait", trait: "Donquixote Pirates", match: "includes" },
          ],
          actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "active" }],
        },
      ],
    })
) {
  throw new Error(
    "OP14-071 must preserve its end-of-turn Leader condition and optional active-DON!! action.",
  );
}
if (options.cardId === "OP14-072") {
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "active" }],
      },
      {
        trigger: "onKo",
        costs: [{ cost: "returnDon", amount: 1 }],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: { amount: 1, upTo: true },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-072 must preserve optional active DON!! addition, DON!! −1, and optional top-deck-to-top-Life movement.",
    );
  }
}
if (options.cardId === "OP14-074") {
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        conditions: [{ condition: "leaderTrait", trait: "Donquixote Pirates", match: "includes" }],
        actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "active" }],
      },
      {
        trigger: "onKo",
        actions: [
          { action: "draw", player: "self", amount: 2 },
          { action: "trashFromHand", player: "self", amount: 1 },
          { action: "addDon", count: { amount: 2, upTo: true }, state: "rested" },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-074 must preserve its Leader-gated active DON!! ramp and ordered On K.O. draw, hand trash, and rested DON!! ramp.",
    );
  }
}
if (options.cardId === "OP14-075") {
  const expected = {
    effects: [
      {
        trigger: "onKo",
        actions: [
          { action: "addDon", count: { amount: 1, upTo: true }, state: "rested" },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-075 must preserve optional rested DON!! addition followed by an optional −2000 opposing-Character modifier.",
    );
  }
}
if (options.cardId === "OP14-081") {
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        actions: [{ action: "trashFromDeck", player: "self", amount: 3 }],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "baseCost", comparison: "eq", value: 1 }],
            },
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-081 must preserve top-three deck trashing and an optional base-cost-exactly-1 opposing Character K.O.",
    );
  }
}
if (options.cardId === "OP14-082") {
  const expected = {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: "all" },
              filters: [{ filter: "trait", value: "Thriller Bark Pirates", match: "includes" }],
            },
            value: 4,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cost", comparison: "lte", value: 2 },
              { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
              { filter: "cardCategory", value: "character" },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-082 must preserve its all-friendly-Thriller-Bark +4 cost effect and its optional rested trash-play Trigger.",
    );
  }
}
if (options.cardId === "OP14-083") {
  const expected = {
    effects: [
      {
        trigger: "activateMain",
        costs: [{ cost: "trashThisCard" }],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "eq", value: 0 }],
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-083 must preserve its optional self-trash cost and optional −3000 current-cost-0 opposing Character modifier.",
    );
  }
}
if (options.cardId === "OP14-084") {
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        conditions: [{ condition: "leaderTrait", trait: "Baroque Works", match: "includes" }],
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cost", comparison: "lte", value: 4 },
              { filter: "trait", value: "Baroque Works", match: "includes" },
              { filter: "cardCategory", value: "character" },
            ],
          },
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cost", comparison: "eq", value: 1 },
              { filter: "trait", value: "Baroque Works", match: "includes" },
              { filter: "cardCategory", value: "character" },
            ],
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-084 must preserve its Leader condition and distinct Baroque Works cost filters on both trash-play actions.",
    );
  }
}
if (
  options.cardId === "OP14-085" &&
  stable(generated) !==
    stable({
      effects: [
        {
          trigger: "onKo",
          actions: [
            { action: "draw", player: "self", amount: 2 },
            { action: "trashFromHand", player: "self", amount: 2 },
          ],
        },
      ],
    })
) {
  throw new Error("OP14-085 must preserve ordered draw-2 then trash-2 On K.O. actions.");
}
if (options.cardId === "OP14-086") {
  const expected = {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 7,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: "all" },
              filters: [{ filter: "trait", value: "Baroque Works", match: "includes" }],
            },
            value: 2,
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-086 must preserve its trash-7 condition, self +1000 power, and all-Baroque-Works +2 cost actions.",
    );
  }
}
if (options.cardId === "OP14-087") {
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        conditions: [{ condition: "leaderTrait", trait: "Baroque Works", match: "includes" }],
        actions: [
          {
            action: "search",
            lookCount: 4,
            source: { player: "self", zone: "deck" },
            revealCount: { amount: 1, upTo: true },
            revealFilters: [
              { filter: "excludeName", value: "Miss.Valentine(Mikita)" },
              { filter: "trait", value: "Baroque Works", match: "includes" },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-087 must preserve its Leader condition, Baroque Works search filter, self-name exclusion, and trash remainder.",
    );
  }
}
if (options.cardId === "OP14-088") {
  const expected = {
    effects: [
      {
        trigger: "onKo",
        conditions: [{ condition: "leaderTrait", trait: "Baroque Works", match: "includes" }],
        actions: [
          { action: "draw", player: "self", amount: 1 },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["stage"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "eq", value: 1 }],
            },
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-088 must preserve its Leader condition and ordered draw-1 then optional opposing cost-1 Stage K.O.",
    );
  }
}
if (options.cardId === "OP14-089") {
  const expected = {
    effects: [
      {
        trigger: "onKo",
        actions: [
          { action: "draw", player: "self", amount: 2 },
          { action: "trashFromHand", player: "self", amount: 2 },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cost", comparison: "lte", value: 4 },
              { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
              { filter: "cardCategory", value: "character" },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-089 must preserve ordered On K.O. hand replacement and its rested cost-4-or-less Thriller Bark trash-play Trigger.",
    );
  }
}
if (options.cardId === "OP14-090") {
  const costZeroOrEightPlus = {
    condition: "compound",
    operator: "or",
    conditions: [
      {
        condition: "existsOnField",
        zone: "character",
        filters: [{ filter: "cost", comparison: "eq", value: 0 }],
      },
      {
        condition: "existsOnField",
        zone: "character",
        filters: [{ filter: "cost", comparison: "gte", value: 8 }],
      },
    ],
  };
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "eq", value: 0 }],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [costZeroOrEightPlus],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            keyword: "rushCharacter",
            duration: "permanent",
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-090 must preserve cost-0-or-8+ conditional Rush: Character and its optional opposing cost-0 rest action.",
    );
  }
}
if (options.cardId === "OP14-091") {
  const expected = {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: ["hand", "trash"] },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "excludeName", value: "Mr.2.Bon.Kurei(Bentham)" },
              { filter: "cost", comparison: "lte", value: 5 },
              { filter: "trait", value: "Baroque Works", match: "includes" },
              { filter: "cardCategory", value: "character" },
            ],
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-091 must preserve its optional hand-or-trash play with Baroque Works, cost-5-or-less, Character, and self-name exclusion filters.",
    );
  }
}
if (options.cardId === "OP14-092") {
  const expected = {
    replacementEffects: [
      {
        replacedEvent: "ko",
        eventFilter: { targetSelf: true },
        replacementAction: {
          action: "returnToDeck",
          target: {
            player: "self",
            zones: ["trash"],
            count: { amount: 3 },
          },
          position: "bottom",
        },
        conditions: [{ condition: "turn", value: "opponent" }],
        oncePerTurn: true,
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-092 must preserve its opponent-turn once-per-turn K.O. replacement and exact three-card trash-to-deck action.",
    );
  }
}
if (options.cardId === "OP14-093") {
  const expected = {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cardCategory", value: "character" },
                { filter: "trait", value: "Baroque Works", match: "includes" },
                { filter: "cost", comparison: "lte", value: 8 },
              ],
            },
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-093 must preserve Blocker and its optional cost-8-or-less Baroque Works Character trash-to-hand action.",
    );
  }
}
if (options.cardId === "OP14-094") {
  const costZeroOrEightPlus = {
    condition: "compound",
    operator: "or",
    conditions: [
      {
        condition: "existsOnField",
        zone: "character",
        filters: [{ filter: "cost", comparison: "eq", value: 0 }],
      },
      {
        condition: "existsOnField",
        zone: "character",
        filters: [{ filter: "cost", comparison: "gte", value: 8 }],
      },
    ],
  };
  const expected = {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [costZeroOrEightPlus],
        actions: [
          { action: "draw", player: "self", amount: 2 },
          { action: "trashFromHand", player: "self", amount: 1 },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-094 must preserve Blocker and ordered draw-2 then trash-1 behind its cost-0-or-8+ Character condition.",
    );
  }
}
if (options.cardId === "OP14-100") {
  const expected = {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: { player: "self", zone: "deck" },
            revealCount: { amount: 1, upTo: true },
            revealFilters: [{ filter: "trait", value: "Thriller Bark Pirates", match: "includes" }],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cost", comparison: "lte", value: 4 },
              { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
              { filter: "cardCategory", value: "character" },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-100 must preserve its filtered top-three On K.O. search and separate rested trash-play Trigger.",
    );
  }
}
if (
  options.cardId === "OP14-102" &&
  stable(generated) !==
    stable({
      effects: [
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 4 },
                { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
              playState: "rested",
            },
          ],
        },
      ],
    })
) {
  throw new Error(
    "OP14-102 must preserve its optional cost-4-or-less Thriller Bark Pirates Character trash-play Trigger and rested play state.",
  );
}
if (
  options.cardId === "OP14-103" &&
  stable(generated) !==
    stable({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "addLifeToHand", amount: 1, position: "choice" }],
          actions: [
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: ["hand"],
                count: { amount: 1, upTo: true },
              },
              position: "top",
            },
          ],
          optional: true,
        },
        {
          trigger: "trigger",
          actions: [{ action: "playThisCard" }],
        },
      ],
    })
) {
  throw new Error(
    "OP14-103 must preserve its top-or-bottom Life-to-hand cost, optional hand-to-top-Life action, and self-only play Trigger.",
  );
}
if (options.cardId === "OP14-104") {
  const eligibilityFilters = [
    { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
    { filter: "cost", comparison: "lte", value: 4 },
    { filter: "cardCategory", value: "character" },
  ];
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "play",
                  source: { player: "self", zone: "trash" },
                  count: { amount: 1, upTo: true },
                  filters: eligibilityFilters,
                },
              ],
              [
                {
                  action: "addToLife",
                  target: {
                    player: "self",
                    zones: ["trash"],
                    count: { amount: 1, upTo: true },
                    filters: eligibilityFilters,
                  },
                  position: "top",
                  faceUp: true,
                },
              ],
            ],
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cost", comparison: "lte", value: 4 },
              { filter: "cardCategory", value: "character" },
            ],
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-104 must preserve both filtered On Play destinations and its separate cost-filtered Character trash-play Trigger.",
    );
  }
}
if (options.cardId === "OP14-105") {
  const expected = {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "revealFromHand",
            amount: 3,
            filters: [
              {
                filter: "anyOf",
                filters: [
                  { filter: "trait", value: "Amazon Lily", match: "includes" },
                  { filter: "trait", value: "Kuja Pirates", match: "includes" },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: "all" },
            },
            count: { amount: 1, upTo: true },
            donState: "rested",
            distribution: "each",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
      {
        trigger: "trigger",
        conditions: [{ condition: "leaderTrait", trait: "Kuja Pirates", match: "includes" }],
        actions: [{ action: "playThisCard" }],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-105 must preserve its alternative-trait reveal cost, once-per-turn DON!! distribution, and Leader-gated self-play Trigger.",
    );
  }
}
if (
  options.cardId === "OP14-106" &&
  stable(generated) !==
    stable({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "trigger",
          actions: [{ action: "playThisCard" }],
        },
      ],
    })
) {
  throw new Error("OP14-106 must preserve Blocker and its self-only play Trigger.");
}
if (options.cardId === "OP14-107") {
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        conditions: [{ condition: "lifeCount", player: "opponent", comparison: "lte", value: 3 }],
        actions: [
          { action: "draw", player: "self", amount: 2 },
          { action: "trashFromHand", player: "self", amount: 2 },
        ],
      },
      {
        trigger: "trigger",
        conditions: [{ condition: "leaderTrait", trait: "Kuja Pirates", match: "includes" }],
        actions: [{ action: "playThisCard" }],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-107 must preserve its Life-gated draw-then-trash sequence and Leader-gated self-play Trigger.",
    );
  }
}
if (options.cardId === "OP14-108") {
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              { condition: "leaderMulticolored" },
              { condition: "lifeCount", player: "opponent", comparison: "lte", value: 3 },
            ],
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "basePower", comparison: "lte", value: 7000 }],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "activateEffect", effectTrigger: "onPlay" }],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-108 must preserve both On Play conditions, the base-power target, and its Trigger activation of On Play.",
    );
  }
}
if (options.cardId === "OP14-109") {
  const expected = {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cost", comparison: "lte", value: 4 },
              { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
              { filter: "cardCategory", value: "character" },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error("OP14-109 must preserve Blocker and its filtered rested trash-play Trigger.");
  }
}
if (options.cardId === "OP14-110") {
  const expected = {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "excludeName", value: "Dr. Hogback" },
              { filter: "hasTrigger", value: true },
              { filter: "cost", comparison: "lte", value: 4 },
              { filter: "cardCategory", value: "character" },
            ],
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cost", comparison: "lte", value: 4 },
              { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
              { filter: "cardCategory", value: "character" },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-110 must preserve the Trigger-bearing non-self On K.O. play filter and its filtered rested life Trigger.",
    );
  }
}
if (options.cardId === "OP14-111") {
  const cannotAttackAction = {
    action: "cannotAttack",
    target: {
      player: "opponent",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "cost", comparison: "lte", value: 6 }],
    },
    duration: "untilEndOfOpponentNextEndPhase",
  };
  const expected = {
    effects: [
      { trigger: "onPlay", actions: [cannotAttackAction] },
      { trigger: "onKo", actions: [cannotAttackAction] },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cost", comparison: "lte", value: 4 },
              { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
              { filter: "cardCategory", value: "character" },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-111 must preserve both cannot-attack triggers, their duration and cost filter, and its filtered rested life Trigger.",
    );
  }
}
if (options.cardId === "OP14-112") {
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "The Seven Warlords of the Sea",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: { player: "self", zones: ["deck"], count: { amount: 1, upTo: true } },
            position: "top",
          },
          {
            action: "removeFromLife",
            player: "opponent",
            count: { amount: 1, upTo: true },
            destination: "hand",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "hand" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "hasTrigger", value: true },
              { filter: "power", comparison: "lte", value: 6000 },
              { filter: "cardCategory", value: "character" },
            ],
          },
        ],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-112 must preserve its Leader-gated Life exchange and the power/Trigger/Character hand-play filters.",
    );
  }
}
if (options.cardId === "OP14-113") {
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: { player: "self", zone: "deck" },
            revealCount: { amount: 1, upTo: true },
            revealFilters: [
              {
                filter: "anyOf",
                filters: [
                  { filter: "trait", value: "Amazon Lily", match: "includes" },
                  { filter: "trait", value: "Kuja Pirates", match: "includes" },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          { action: "trashFromHand", player: "self", amount: 1 },
        ],
      },
      {
        trigger: "trigger",
        conditions: [{ condition: "leaderTrait", trait: "Kuja Pirates", match: "includes" }],
        actions: [{ action: "playThisCard" }],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-113 must preserve alternative search traits, ordered remainder placement, post-search hand trash, and its Leader-gated self-play Trigger.",
    );
  }
}
if (options.cardId === "OP14-114") {
  const expected = {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1 },
              filters: [{ filter: "trait", value: "Kuja Pirates", match: "includes" }],
            },
            count: { amount: 1, upTo: true },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "trigger",
        conditions: [{ condition: "leaderTrait", trait: "Kuja Pirates", match: "includes" }],
        actions: [{ action: "playThisCard" }],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-114 must preserve once-per-turn filtered rested-DON distribution and its Leader-gated self-play Trigger.",
    );
  }
}
if (options.cardId === "OP14-115") {
  const expected = {
    effects: [
      {
        trigger: "onKo",
        conditions: [{ condition: "turn", value: "opponent" }],
        actions: [
          {
            action: "addToLife",
            target: { player: "self", zones: ["deck"], count: { amount: 1, upTo: true } },
            position: "top",
          },
          { action: "dealDamage", player: "self", amount: 1 },
        ],
      },
      {
        trigger: "trigger",
        conditions: [{ condition: "leaderTrait", trait: "Kuja Pirates", match: "includes" }],
        actions: [{ action: "playThisCard" }],
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-115 must preserve opponent-turn On K.O. timing, optional Life addition followed by self-damage, and its Leader-gated self-play Trigger.",
    );
  }
}
if (options.cardId === "OP14-119") {
  const expected = {
    effects: [
      {
        trigger: "whenBecomesRested",
        eventFilter: { targetSelf: true },
        conditions: [{ condition: "turn", value: "your" }],
        actions: [
          {
            action: "cannotBeRested",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 9 }],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        costs: [{ cost: "trashFromHand", amount: 1 }],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-119 must preserve your-turn becomes-rested timing, exact End Phase duration, and its optional once-per-turn opponent-attack power effect.",
    );
  }
}
if (options.cardId === "OP14-120") {
  const qualifyingOpponentCost = {
    condition: "compound",
    operator: "or",
    conditions: [
      {
        condition: "hasCard",
        player: "opponent",
        zone: "character",
        filters: [{ filter: "cost", comparison: "eq", value: 0 }],
      },
      {
        condition: "hasCard",
        player: "opponent",
        zone: "character",
        filters: [{ filter: "cost", comparison: "gte", value: 8 }],
      },
    ],
  };
  const expected = {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 9 }],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
          { action: "draw", player: "self", amount: 1, condition: qualifyingOpponentCost },
        ],
      },
      {
        trigger: "onKo",
        costs: [{ cost: "trashFromHand", amount: 1 }],
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1 },
            self: true,
          },
        ],
        optional: true,
      },
    ],
  };
  if (stable(generated) !== stable(expected)) {
    throw new Error(
      "OP14-120 must preserve its attack restriction, opponent-only cost-0-or-8+ conditional draw, and optional self-only On K.O. replay.",
    );
  }
}
if (/swap the base power/i.test(printedText) && !stable(generated).includes('"swapBasePower"')) {
  throw new Error(
    `${options.cardId} says to swap base power, but the parser did not emit swapBasePower.`,
  );
}
if (
  /when this Character becomes rested/i.test(printedText) &&
  !stable(generated).includes('"whenBecomesRested"')
) {
  throw new Error(
    `${options.cardId} has a becomes-rested trigger, but the parser did not emit whenBecomesRested.`,
  );
}
const dependentIfYouDoPreservedAsCosts =
  /you\s+may[\s\S]+If\s+you\s+do,/i.test(printedText) &&
  generated?.effects?.some(
    (effect) => effect.optional && Boolean(effect.costs?.length) && effect.actions.length > 0,
  );
if (
  /If you do,/i.test(printedText) &&
  !stable(generated).includes('"thenActions"') &&
  !dependentIfYouDoPreservedAsCosts
) {
  throw new Error(
    `${options.cardId} has a dependent "If you do" clause, but the parser did not preserve it.`,
  );
}
if (
  /at the end of this turn/i.test(printedText) &&
  !stable(generated).includes('"timing":"endOfThisTurn"')
) {
  throw new Error(
    `${options.cardId} has an at-the-end-of-this-turn action, but the parser did not preserve its timing.`,
  );
}
if (
  /until the end of your opponent's next End Phase/i.test(printedText) &&
  !stable(generated).includes('"untilEndOfOpponentNextEndPhase"')
) {
  throw new Error(
    `${options.cardId} has a next-End-Phase duration, but the parser did not preserve it.`,
  );
}
if (
  /your\s+\{[^}]+\}\s+type Character would be K\.O\.'d/i.test(printedText) &&
  !stable(generated).includes('"target"')
) {
  throw new Error(
    `${options.cardId} has a filtered non-self replacement, but the parser did not preserve its target.`,
  );
}
if (
  /would be K\.O\.'d by your opponent's effect/i.test(printedText) &&
  !stable(generated).includes('"source":"opponentEffect"')
) {
  throw new Error(
    `${options.cardId} has an opponent-effect replacement, but the parser did not preserve its source.`,
  );
}
if (/will not become active in your opponent's next Refresh Phase/i.test(printedText)) {
  const freezeActions = generated.effects?.flatMap((effect) =>
    flattenActions(effect.actions).filter((action) => action.action === "freeze"),
  );
  if (!freezeActions?.length) {
    throw new Error(
      `${options.cardId} has a next-Refresh-Phase freeze, but the parser did not emit freeze.`,
    );
  }

  const freezeTarget = freezeActions[0]!.target;
  if (
    /up to 1 of your opponent's rested Characters with a cost of 4 or less/i.test(printedText) &&
    (freezeTarget.player !== "opponent" ||
      !freezeTarget.zones.includes("character") ||
      freezeTarget.count.amount !== 1 ||
      freezeTarget.count.upTo !== true ||
      !freezeTarget.filters?.some(
        (filter) => filter.filter === "state" && filter.value === "rested",
      ) ||
      !freezeTarget.filters?.some(
        (filter) => filter.filter === "cost" && filter.comparison === "lte" && filter.value === 4,
      ))
  ) {
    throw new Error(
      `${options.cardId} has a filtered optional freeze target, but the parser did not preserve all target constraints.`,
    );
  }
}
if (
  /look at 4 cards from the top of your deck; reveal up to 1 card with a cost of 2 or more/i.test(
    printedText,
  )
) {
  const searchActions = generated.effects?.flatMap((effect) =>
    effect.actions.filter((action) => action.action === "search"),
  );
  const search = searchActions?.[0];
  if (
    !search ||
    search.lookCount !== 4 ||
    search.source.player !== "self" ||
    search.source.zone !== "deck" ||
    search.revealCount.amount !== 1 ||
    search.revealCount.upTo !== true ||
    search.revealDestination !== "hand" ||
    search.remainderPosition !== "bottom" ||
    !search.revealFilters?.some(
      (filter) => filter.filter === "cost" && filter.comparison === "gte" && filter.value === 2,
    )
  ) {
    throw new Error(
      `${options.cardId} has a filtered top-deck search, but the parser did not preserve its complete search semantics.`,
    );
  }
}
if (
  /\{[^}]+\}\s+or\s+\{[^}]+\}\s+type/i.test(printedText) &&
  !stable(generated).includes('"filter":"anyOf"') &&
  !(
    stable(generated).includes('"condition":"compound"') &&
    stable(generated).includes('"operator":"or"')
  )
) {
  throw new Error(
    `${options.cardId} has alternative target traits, but the parser did not preserve their OR semantics.`,
  );
}
if (/Reveal 1 card from the top of your deck\. If that card's type includes/i.test(printedText)) {
  const reveal = generated.effects
    ?.flatMap((effect) => effect.actions)
    .find((action) => action.action === "revealFromDeck");
  const conditional =
    reveal?.action === "revealFromDeck" ? reveal.ifRevealedCardMatches : undefined;
  if (
    !conditional?.filters.some(
      (filter) => filter.filter === "trait" && filter.value === "Whitebeard Pirates",
    ) ||
    conditional.actions[0]?.action !== "draw" ||
    conditional.actions[0].amount !== 2 ||
    conditional.actions[1]?.action !== "trashFromHand" ||
    conditional.actions[1].amount !== 1
  ) {
    throw new Error(
      `${options.cardId} has a revealed-card trait branch, but the parser did not preserve its conditional draw and hand-trash sequence.`,
    );
  }
}
if (/When a card is trashed from your hand by an effect/i.test(printedText)) {
  const trigger = generated.effects?.find(
    (effect) => effect.trigger === "whenCardTrashedFromHandByEffect",
  );
  if (!trigger) {
    throw new Error(
      `${options.cardId} has a hand-trash-by-effect trigger, but the parser did not preserve its event source.`,
    );
  }
  if (/this Character gains \[Rush\]/i.test(printedText)) {
    const rush = trigger.actions.find((action) => action.action === "grantKeyword");
    if (
      !rush ||
      rush.keyword !== "rush" ||
      rush.duration !== "thisTurn" ||
      !rush.target.self ||
      !rush.target.zones.includes("character")
    ) {
      throw new Error(
        `${options.cardId} has a hand-trash-by-effect Rush trigger, but the parser did not preserve its self target, keyword, and duration.`,
      );
    }
  }
  if (/this Character['’]s effect is negated during this turn/i.test(printedText)) {
    const negate = trigger.actions.find((action) => action.action === "negateEffects");
    if (
      !negate ||
      negate.duration !== "thisTurn" ||
      !negate.target.self ||
      !negate.target.zones.includes("character")
    ) {
      throw new Error(
        `${options.cardId} negates its own effect after the hand-trash trigger, but the parser did not preserve its self target and duration.`,
      );
    }
  }
}
if (/^This Character cannot attack\./i.test(printedText)) {
  const restriction = generated.permanentEffects
    ?.flatMap((effect) => effect.actions)
    .find((action) => action.action === "cannotAttack");
  if (
    restriction?.action !== "cannotAttack" ||
    restriction.duration !== "permanent" ||
    !restriction.target.self ||
    !restriction.target.zones.includes("character")
  ) {
    throw new Error(
      `${options.cardId} has a self attack prohibition, but the parser did not preserve it as a permanent self restriction.`,
    );
  }
}
if (
  /your \{Donquixote Pirates\} type Character would be removed from the field/i.test(printedText)
) {
  const replacement = generated.replacementEffects?.find(
    (effect) => effect.replacedEvent === "removeFromField",
  );
  if (
    !replacement ||
    replacement.source !== "opponentEffect" ||
    !replacement.oncePerTurn ||
    replacement.target?.player !== "self" ||
    !replacement.target.zones.includes("character") ||
    !replacement.target.filters?.some(
      (filter) => filter.filter === "trait" && filter.value === "Donquixote Pirates",
    ) ||
    replacement.replacementAction.action !== "returnDon" ||
    replacement.replacementAction.player !== "self" ||
    replacement.replacementAction.amount !== 1
  ) {
    throw new Error(
      `${options.cardId} has a once-per-turn filtered removal replacement, but the parser did not preserve its target, source, or controller-owned DON!! return.`,
    );
  }
}
if (/\[When Attacking\] DON!! −1:.+−2000 power during this turn/i.test(printedText)) {
  const effect = generated.effects?.find((candidate) => candidate.trigger === "whenAttacking");
  const cost = effect?.costs?.find((candidate) => candidate.cost === "returnDon");
  const action = effect?.actions.find((candidate) => candidate.action === "modifyPower");
  if (
    cost?.cost !== "returnDon" ||
    !("amount" in cost) ||
    cost.amount !== 1 ||
    action?.action !== "modifyPower" ||
    action.value !== -2000 ||
    action.duration !== "thisTurn" ||
    action.target.player !== "opponent" ||
    !action.target.zones.includes("character") ||
    action.target.count.amount !== 1 ||
    !action.target.count.upTo
  ) {
    throw new Error(
      `${options.cardId} has a DON!! −1 When Attacking debuff, but the parser did not preserve its cost, sign, duration, and optional target.`,
    );
  }
}
if (/\[On K\.O\.\] DON!! −1.+K\.O\. or rest up to 1/i.test(printedText)) {
  const effect = generated.effects?.find((candidate) => candidate.trigger === "onKo");
  const cost = effect?.costs?.find((candidate) => candidate.cost === "returnDon");
  const choice = effect?.actions.find((candidate) => candidate.action === "choice");
  const branches = choice?.action === "choice" ? choice.options : [];
  const ko = branches.flat().find((action) => action.action === "ko");
  const rest = branches.flat().find((action) => action.action === "rest");
  const targetIsCorrect = (action: typeof ko | typeof rest) =>
    action &&
    "target" in action &&
    action.target.player === "opponent" &&
    action.target.zones.includes("character") &&
    action.target.count.amount === 1 &&
    action.target.count.upTo === true &&
    action.target.filters?.some(
      (filter) =>
        filter.filter === "basePower" && filter.comparison === "lte" && filter.value === 6000,
    );
  if (
    cost?.cost !== "returnDon" ||
    !("amount" in cost) ||
    cost.amount !== 1 ||
    branches.length !== 2 ||
    !targetIsCorrect(ko) ||
    !targetIsCorrect(rest)
  ) {
    throw new Error(
      `${options.cardId} has a DON!! −1 On K.O. choice, but the parser did not preserve both complete filtered branches.`,
    );
  }
}
if (/trash all cards from your hand/i.test(printedText)) {
  const trashAll = generated.effects
    ?.flatMap((effect) => effect.actions)
    .find((action) => action.action === "trashFromHand" && action.player === "self");
  if (trashAll?.action !== "trashFromHand" || trashAll.amount !== "all") {
    throw new Error(
      `${options.cardId} trashes the entire hand, but the parser did not preserve the unbounded amount.`,
    );
  }
}
const restDonCostText = /You may rest (\d+) of your DON!! cards:/i.exec(printedText);
if (restDonCostText) {
  const expectedAmount = Number(restDonCostText[1]);
  const effect = generated.effects?.find((candidate) =>
    candidate.costs?.some((cost) => cost.cost === "restDon"),
  );
  const restDon = effect?.costs?.find((cost) => cost.cost === "restDon");
  if (restDon?.cost !== "restDon" || restDon.amount !== expectedAmount || !effect?.optional) {
    throw new Error(
      `${options.cardId} has an optional DON!! rest cost, but the parser did not preserve its amount and optionality.`,
    );
  }
}
if (/return up to 1 Character .+ to the owner['’]s hand/i.test(printedText)) {
  const returnAction = flattenActions(
    generated.effects?.flatMap((effect) => effect.actions) ?? [],
  ).find((action) => action.action === "returnToHand");
  if (returnAction?.action !== "returnToHand" || returnAction.target.player !== "any") {
    throw new Error(
      `${options.cardId} has an unqualified Character return, but the parser did not allow either player's Character.`,
    );
  }
}
const leaderTraitDrawText = /If your Leader has the \{([^}]+)\} type, draw (\d+) cards?/i.exec(
  printedText,
);
if (leaderTraitDrawText) {
  const expectedTrait = leaderTraitDrawText[1]!;
  const expectedAmount = Number(leaderTraitDrawText[2]);
  const effect = generated.effects?.find((candidate) => {
    const candidateDraw = candidate.actions.find((action) => action.action === "draw");
    const candidateCondition =
      candidate.conditions?.find((condition) => condition.condition === "leaderTrait") ??
      candidateDraw?.condition;
    return (
      candidateDraw?.action === "draw" &&
      candidateCondition?.condition === "leaderTrait" &&
      candidateCondition.trait === expectedTrait
    );
  });
  const draw = effect?.actions.find((action) => action.action === "draw");
  const condition =
    effect?.conditions?.find((candidate) => candidate.condition === "leaderTrait") ??
    draw?.condition;
  if (
    condition?.condition !== "leaderTrait" ||
    condition.trait !== expectedTrait ||
    draw?.action !== "draw" ||
    draw.player !== "self" ||
    draw.amount !== expectedAmount
  ) {
    throw new Error(
      `${options.cardId} has a Leader-type-gated draw, but the parser did not preserve its condition and amount.`,
    );
  }
}
const donOnKoDrawText = /\[DON!! x(\d+)\]\s*\[On K\.O\.\]\s*Draw (\d+) cards?/i.exec(printedText);
if (donOnKoDrawText) {
  const expectedDon = Number(donOnKoDrawText[1]);
  const expectedDraw = Number(donOnKoDrawText[2]);
  const effect = generated.effects?.find((candidate) => candidate.trigger === "onKo");
  const condition = effect?.conditions?.find((candidate) => candidate.condition === "donAttached");
  const draw = effect?.actions.find((action) => action.action === "draw");
  if (
    condition?.condition !== "donAttached" ||
    condition.amount !== expectedDon ||
    draw?.action !== "draw" ||
    draw.player !== "self" ||
    draw.amount !== expectedDraw
  ) {
    throw new Error(
      `${options.cardId} has a DON!!-conditioned On K.O. draw, but the parser did not preserve its condition and amount.`,
    );
  }
}
const trashToPlayText =
  /You may trash (\d+) cards from your hand: Play up to 1 \{([^}]+)\} type Character card with a cost of (\d+) or less from your hand/i.exec(
    printedText,
  );
if (trashToPlayText) {
  const expectedTrash = Number(trashToPlayText[1]);
  const expectedTrait = trashToPlayText[2]!;
  const expectedCost = Number(trashToPlayText[3]);
  const effect = generated.effects?.find((candidate) => candidate.trigger === "onPlay");
  const cost = effect?.costs?.find((candidate) => candidate.cost === "trashFromHand");
  const play = effect?.actions.find((action) => action.action === "play");
  if (
    !effect?.optional ||
    cost?.cost !== "trashFromHand" ||
    cost.amount !== expectedTrash ||
    play?.action !== "play" ||
    play.source.player !== "self" ||
    play.source.zone !== "hand" ||
    play.count.amount !== 1 ||
    !play.count.upTo ||
    !play.filters?.some((filter) => filter.filter === "trait" && filter.value === expectedTrait) ||
    !play.filters?.some(
      (filter) =>
        filter.filter === "cost" && filter.comparison === "lte" && filter.value === expectedCost,
    ) ||
    !play.filters?.some(
      (filter) => filter.filter === "cardCategory" && filter.value === "character",
    )
  ) {
    throw new Error(
      `${options.cardId} has an optional hand-trash-to-play effect, but the parser did not preserve its cost and complete target filter.`,
    );
  }
}
if (/base power becomes the same as your Leader['’]s base power/i.test(printedText)) {
  const effect = generated.permanentEffects?.find((candidate) =>
    candidate.actions.some((action) => action.action === "setBasePowerFrom"),
  );
  const turn = effect?.conditions?.find((condition) => condition.condition === "turn");
  const hand = effect?.conditions?.find((condition) => condition.condition === "handCount");
  const action = effect?.actions.find((candidate) => candidate.action === "setBasePowerFrom");
  if (
    turn?.condition !== "turn" ||
    turn.value !== "opponent" ||
    hand?.condition !== "handCount" ||
    hand.player !== "self" ||
    hand.comparison !== "lte" ||
    hand.value !== 7 ||
    action?.action !== "setBasePowerFrom" ||
    !action.target.self ||
    !action.target.zones.includes("character") ||
    action.source.player !== "self" ||
    !action.source.zones.includes("leader") ||
    action.duration !== "permanent"
  ) {
    throw new Error(
      `${options.cardId} copies its Leader's base power conditionally, but the parser did not preserve the source and complete permanent-effect conditions.`,
    );
  }
}
const trashUntilHandText =
  /Trash cards from your hand until you have (\d+) cards in your hand/i.exec(printedText);
if (trashUntilHandText) {
  const expectedHandSize = Number(trashUntilHandText[1]);
  const effect = generated.effects?.find((candidate) => candidate.trigger === "endOfYourTurn");
  const action = effect?.actions.find((candidate) => candidate.action === "trashFromHandUntil");
  if (
    action?.action !== "trashFromHandUntil" ||
    action.player !== "self" ||
    action.handSize !== expectedHandSize
  ) {
    throw new Error(
      `${options.cardId} trashes down to a hand limit, but the parser did not preserve the limit semantics.`,
    );
  }
}
if (
  options.cardId === "OP14-054" &&
  (card.cost !== 6 ||
    !card.traits?.includes("Fish-Man") ||
    !card.traits.includes("The Sun Pirates") ||
    card.traits.length !== 2)
) {
  throw new Error(
    "OP14-054 official metadata requires cost 6 and separate Fish-Man/The Sun Pirates traits.",
  );
}
const matches = stable(generated) === stable(card.effects);
console.log(`${options.cardId} ${card.name}`);
console.log(`definition: ${file}`);
console.log(`printed text: ${JSON.stringify(printedText)}`);

if (matches) {
  console.log("structured effects: PASS");
  process.exit(0);
}

console.log("structured effects: MISMATCH");
console.log(`current: ${JSON.stringify(card.effects ?? null, null, 2)}`);
console.log(`generated: ${JSON.stringify(generated ?? null, null, 2)}`);

if (!options.write) {
  console.error("No files changed. Re-run with --write after reviewing the generated structure.");
  process.exit(1);
}

replaceEffects(file, generated);
console.log(`updated: ${file}`);
