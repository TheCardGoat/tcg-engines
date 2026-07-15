import type { ActionCard, CharacterCard, ItemCard, LocationCard } from "@tcg/lorcana-types";
import { readdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllCards } from "./index";

type LorcanaCard = CharacterCard | ActionCard | ItemCard | LocationCard;

type CardFiles = {
  definition: string | null;
  test: string | null;
};

type RankedCard = {
  card: LorcanaCard;
  score: number;
  reason: string[];
  setNumber: number;
  cardId: string;
};

type CardSummary = {
  name: string;
  title: string;
  cardId: string;
  set: string;
  number: number;
  type: "character" | "action" | "item" | "location";
  definition: string | null;
};

export type SimilarityResult =
  | {
      status: "ok";
      name: string;
      title: string;
      cardId: string;
      set: string;
      number: number;
      type: "character" | "action" | "item" | "location";
      files: CardFiles;
      similarCards: Array<{
        cardId: string;
        score: number;
        reason: string[];
        definition: string | null;
        test: string | null;
      }>;
    }
  | {
      status: "ambiguous";
      query: string;
      candidates: CardSummary[];
    }
  | {
      status: "not_found";
      query: string;
      message: string;
    };

const cardsRootDirectory = dirname(fileURLToPath(import.meta.url));
const cardsRootRelative = "packages/lorcana/lorcana-cards/src/cards";

const cardTypeDirectory: Record<LorcanaCard["cardType"], string> = {
  character: "characters",
  action: "actions",
  item: "items",
  location: "locations",
};

const effectVerbs = ["draw", "banish", "damage", "discard", "ready", "exert", "quest", "move"];

const triggerFamilyPatterns: Array<{ key: string; pattern: RegExp }> = [
  { key: "when played", pattern: /\b(when(ever)?\s+you\s+play|when played|on play|play:)\b/i },
  { key: "whenever", pattern: /\bwhenever\b/i },
  {
    key: "start/end of turn",
    pattern: /\b(at|during)\s+the\s+(start|end|beginning)\s+of\s+(your|their|each)?\s*turn\b/i,
  },
  { key: "static while", pattern: /\bwhile\b/i },
];

const directoryFilesCache = new Map<
  string,
  Promise<{ definitions: string[]; tests: Set<string> }>
>();

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['"]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function setNumber(set: string): number {
  const parsed = Number.parseInt(set, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function cardDisplayTitle(card: LorcanaCard): string {
  return card.version ?? "";
}

function buildCardId(card: LorcanaCard): string {
  const slug = slugify(`${card.name} ${card.version ?? ""}`.trim());
  return `${card.set}-${card.cardNumber}-${slug}`;
}

function cardLookupScore(card: LorcanaCard, query: string): number {
  const querySlug = slugify(query);
  const normalizedQuery = normalizeText(query);
  const fullName = `${card.name} ${card.version ?? ""}`.trim();
  const fullNameNormalized = normalizeText(fullName);
  const nameNormalized = normalizeText(card.name);
  const cardSlug = slugify(fullName);
  const idNormalized = normalizeText(card.id);
  const setAndNumber = `${card.set}-${card.cardNumber}`;
  const paddedSetAndNumber = `${card.set}-${String(card.cardNumber).padStart(3, "0")}`;
  const generatedCardId = buildCardId(card);

  if (normalizeText(generatedCardId) === normalizedQuery || querySlug === cardSlug) return 250;
  if (
    normalizeText(setAndNumber) === normalizedQuery ||
    normalizeText(paddedSetAndNumber) === normalizedQuery
  )
    return 240;
  if (idNormalized === normalizedQuery) return 220;
  if (fullNameNormalized === normalizedQuery || nameNormalized === normalizedQuery) return 210;
  if (fullNameNormalized.startsWith(normalizedQuery) && normalizedQuery.length > 2) return 150;
  if (fullNameNormalized.includes(normalizedQuery) && normalizedQuery.length > 2) return 140;
  if (nameNormalized.includes(normalizedQuery) && normalizedQuery.length > 2) return 130;
  if (cardSlug.includes(querySlug) && querySlug.length > 2) return 120;

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  if (queryTokens.length === 0) return 0;

  const cardTokens = new Set(fullNameNormalized.split(" ").filter(Boolean));
  let matched = 0;
  for (const token of queryTokens) {
    if (cardTokens.has(token)) matched += 1;
  }

  if (matched === 0) return 0;
  return 80 + matched * 10;
}

function extractCardText(card: LorcanaCard): string {
  const parts: string[] = [];
  parts.push(card.name);
  if (card.version) parts.push(card.version);

  if (Array.isArray(card.text)) {
    for (const line of card.text) {
      if (typeof line === "string") {
        parts.push(line);
        continue;
      }
      if (line.title) parts.push(line.title);
      if (line.description) parts.push(line.description);
    }
  }

  if (Array.isArray(card.abilities)) {
    for (const ability of card.abilities) {
      if (ability.name) parts.push(ability.name);
      if (ability.text) parts.push(ability.text);
    }
  }

  return parts.join(" ").toLowerCase();
}

function extractEffectVerbs(card: LorcanaCard): Set<string> {
  const text = extractCardText(card);
  const verbs = new Set<string>();
  for (const verb of effectVerbs) {
    if (new RegExp(`\\b${verb}\\b`, "i").test(text)) {
      verbs.add(verb);
    }
  }
  return verbs;
}

function extractTriggerFamilies(card: LorcanaCard): Set<string> {
  const text = extractCardText(card);
  const families = new Set<string>();

  for (const family of triggerFamilyPatterns) {
    if (family.pattern.test(text)) {
      families.add(family.key);
    }
  }

  if (Array.isArray(card.abilities)) {
    for (const ability of card.abilities) {
      if (ability.type === "static") families.add("static while");
      if (ability.type === "triggered") families.add("whenever");
    }
  }

  return families;
}

function extractKeywordFamily(card: LorcanaCard): Set<string> {
  const keywords = new Set<string>();

  if ("classifications" in card && Array.isArray(card.classifications)) {
    for (const classification of card.classifications) {
      keywords.add(classification.toLowerCase());
    }
  }

  if (Array.isArray(card.abilities)) {
    // for (const ability of card.abilities) {
    //   if (ability.keyword) {
    //     keywords.add(ability.keyword.toLowerCase());
    //   }
    // }
  }

  if (card.franchise) {
    keywords.add(card.franchise.toLowerCase());
  }

  return keywords;
}

function extractInkTypes(card: LorcanaCard): Set<string> {
  if (Array.isArray(card.inkType)) {
    return new Set(card.inkType.map((ink) => ink.toLowerCase()));
  }

  return new Set<string>();
}

function sharedValues(left: Set<string>, right: Set<string>): string[] {
  const shared: string[] = [];
  for (const item of left) {
    if (right.has(item)) shared.push(item);
  }
  return shared.sort();
}

function scoreSimilarity(
  target: LorcanaCard,
  candidate: LorcanaCard,
): { score: number; reason: string[] } {
  let score = 0;
  const reason: string[] = [];

  if (target.cardType === candidate.cardType) {
    score += 40;
    reason.push(`same type: ${target.cardType}`);
  }

  const sharedVerbs = sharedValues(extractEffectVerbs(target), extractEffectVerbs(candidate));
  if (sharedVerbs.length > 0) {
    score += 25;
    reason.push(`shared verbs: ${sharedVerbs.join(", ")}`);
  }

  const sharedTriggerFamilies = sharedValues(
    extractTriggerFamilies(target),
    extractTriggerFamilies(candidate),
  );
  if (sharedTriggerFamilies.length > 0) {
    score += 20;
    reason.push(`shared triggers: ${sharedTriggerFamilies.join(", ")}`);
  }

  const sharedKeywords = sharedValues(
    extractKeywordFamily(target),
    extractKeywordFamily(candidate),
  );
  if (sharedKeywords.length > 0) {
    score += 10;
    reason.push(`shared keyword family: ${sharedKeywords.slice(0, 3).join(", ")}`);
  }

  const sharedInk = sharedValues(extractInkTypes(target), extractInkTypes(candidate));
  if (sharedInk.length > 0) {
    score += 5;
    reason.push(`shared ink: ${sharedInk.join(", ")}`);
  }

  return { score, reason };
}

function parseLimit(value: string | undefined, defaultLimit: number): number {
  if (!value) return defaultLimit;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return defaultLimit;
  return parsed;
}

function pickDefinitionFile(definitions: string[], card: LorcanaCard): string | null {
  if (definitions.length === 0) return null;
  if (definitions.length === 1) return definitions[0];

  const targetTokens = new Set(
    slugify(`${card.name} ${card.version ?? ""}`)
      .split("-")
      .filter(Boolean),
  );
  let bestFile: string | null = null;
  let bestScore = -1;

  for (const file of definitions) {
    const withoutExtension = file.replace(/\.ts$/, "");
    const slug = withoutExtension.replace(/^\d+-/, "");
    const tokens = slug.split("-").filter(Boolean);
    let score = 0;
    for (const token of tokens) {
      if (targetTokens.has(token)) score += 1;
    }
    if (score > bestScore || (score === bestScore && (bestFile === null || file < bestFile))) {
      bestScore = score;
      bestFile = file;
    }
  }

  return bestFile;
}

async function listCardDirectoryFiles(
  set: string,
  cardType: LorcanaCard["cardType"],
): Promise<{ definitions: string[]; tests: Set<string> }> {
  const cacheKey = `${set}:${cardType}`;
  const cached = directoryFilesCache.get(cacheKey);
  if (cached) return cached;

  const loader = (async () => {
    const directory = `${cardsRootDirectory}/${set}/${cardTypeDirectory[cardType]}`;
    try {
      const allFiles = await readdir(directory);
      const definitions = allFiles
        .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
        .sort();
      const tests = new Set(allFiles.filter((file) => file.endsWith(".test.ts")));
      return { definitions, tests };
    } catch {
      return { definitions: [], tests: new Set<string>() };
    }
  })();

  directoryFilesCache.set(cacheKey, loader);
  return loader;
}

async function resolveCardFiles(card: LorcanaCard): Promise<CardFiles> {
  const relativeDirectory = `${cardsRootRelative}/${card.set}/${cardTypeDirectory[card.cardType]}`;
  const { definitions, tests } = await listCardDirectoryFiles(card.set, card.cardType);
  const prefix = `${String(card.cardNumber).padStart(3, "0")}-`;
  const candidates = definitions.filter((file) => file.startsWith(prefix));
  const definitionFile = pickDefinitionFile(candidates, card);

  if (!definitionFile) {
    return { definition: null, test: null };
  }

  const definitionPath = `${relativeDirectory}/${definitionFile}`;
  const testFile = definitionFile.replace(/\.ts$/, ".test.ts");
  const testPath = tests.has(testFile) ? `${relativeDirectory}/${testFile}` : null;

  return {
    definition: definitionPath,
    test: testPath,
  };
}

function rankSimilarCards(target: LorcanaCard, cards: LorcanaCard[], limit: number): RankedCard[] {
  return cards
    .filter((candidate) => candidate !== target)
    .map((candidate) => {
      const { score, reason } = scoreSimilarity(target, candidate);
      return {
        card: candidate,
        score,
        reason,
        setNumber: setNumber(candidate.set),
        cardId: buildCardId(candidate),
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (right.setNumber !== left.setNumber) return right.setNumber - left.setNumber;
      return left.cardId.localeCompare(right.cardId);
    })
    .slice(0, limit);
}

async function toCardSummary(card: LorcanaCard): Promise<CardSummary> {
  const files = await resolveCardFiles(card);
  return {
    name: card.name,
    title: cardDisplayTitle(card),
    cardId: buildCardId(card),
    set: card.set,
    number: card.cardNumber,
    type: card.cardType,
    definition: files.definition,
  };
}

function pickCardByQuery(
  cards: LorcanaCard[],
  query: string,
): {
  selected: LorcanaCard | null;
  ambiguous: LorcanaCard[];
} {
  const scored = cards
    .map((card) => ({
      card,
      score: cardLookupScore(card, query),
      set: setNumber(card.set),
      cardId: buildCardId(card),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (right.set !== left.set) return right.set - left.set;
      return left.cardId.localeCompare(right.cardId);
    });

  if (scored.length === 0) {
    return { selected: null, ambiguous: [] };
  }

  const top = scored[0];
  if (top.score >= 220) {
    return { selected: top.card, ambiguous: [] };
  }

  const tiedTopCards = scored
    .filter((entry) => entry.score === top.score)
    .map((entry) => entry.card);
  if (tiedTopCards.length > 1) {
    return { selected: null, ambiguous: tiedTopCards.slice(0, 8) };
  }

  return { selected: top.card, ambiguous: [] };
}

export async function findSimilarCards(query: string, limit = 8): Promise<SimilarityResult> {
  const cards = (await getAllCards()) as LorcanaCard[];
  const { selected, ambiguous } = pickCardByQuery(cards, query);

  if (ambiguous.length > 0) {
    const candidates = await Promise.all(ambiguous.map((card) => toCardSummary(card)));
    return {
      status: "ambiguous",
      query,
      candidates,
    };
  }

  if (!selected) {
    return {
      status: "not_found",
      query,
      message: "No card matched the provided query.",
    };
  }

  const topSimilar = rankSimilarCards(selected, cards, limit);
  const selectedFiles = await resolveCardFiles(selected);
  const similarCards = await Promise.all(
    topSimilar.map(async (entry) => {
      const files = await resolveCardFiles(entry.card);
      return {
        cardId: entry.cardId,
        score: entry.score,
        reason: entry.reason,
        definition: files.definition,
        test: files.test,
      };
    }),
  );

  return {
    status: "ok",
    name: selected.name,
    title: cardDisplayTitle(selected),
    cardId: buildCardId(selected),
    set: selected.set,
    number: selected.cardNumber,
    type: selected.cardType,
    files: selectedFiles,
    similarCards,
  };
}

type CliOptions = {
  query: string;
  limit: number;
  showHelp: boolean;
};

function parseCliArgs(args: string[]): CliOptions {
  let query = "";
  let limit = 8;
  let showHelp = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      showHelp = true;
      continue;
    }
    if (arg === "--query" || arg === "-q") {
      query = args[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg.startsWith("--query=")) {
      query = arg.slice("--query=".length);
      continue;
    }
    if (arg === "--limit" || arg === "-n") {
      limit = parseLimit(args[index + 1], limit);
      index += 1;
      continue;
    }
    if (arg.startsWith("--limit=")) {
      limit = parseLimit(arg.slice("--limit=".length), limit);
      continue;
    }
    if (!arg.startsWith("-") && query.length === 0) {
      query = arg;
      continue;
    }
  }

  return { query, limit, showHelp };
}

function printUsage(): void {
  console.log("Find similar Lorcana cards");
  console.log("");
  console.log("Usage:");
  console.log(
    '  bun packages/lorcana/lorcana-cards/src/cards/similarity.ts --query "Ariel On Human Legs" --limit 8',
  );
  console.log("");
  console.log("Flags:");
  console.log("  -q, --query   Card id, set-number, slug, or name");
  console.log("  -n, --limit   Number of similar cards to return (default: 8)");
  console.log("  -h, --help    Show this help");
}

async function runCli(): Promise<void> {
  const options = parseCliArgs(process.argv.slice(2));
  if (options.showHelp || options.query.trim().length === 0) {
    printUsage();
    if (options.query.trim().length === 0 && !options.showHelp) {
      process.exitCode = 1;
    }
    return;
  }

  const result = await findSimilarCards(options.query, options.limit);
  console.log(JSON.stringify(result, null, 2));
  if (result.status === "not_found") {
    process.exitCode = 1;
  }
}

if (import.meta.main) {
  runCli().catch((error) => {
    console.error(
      JSON.stringify(
        {
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  });
}
