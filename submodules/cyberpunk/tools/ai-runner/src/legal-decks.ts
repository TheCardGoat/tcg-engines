import type { CardCatalog, DeckList } from "@tcg/cyberpunk-engine";
import type { CardDefinition } from "@tcg/cyberpunk-types";
import { deckLists, structuredCards } from "@tcg/cyberpunk-cards";
import { validateDeck } from "../../../packages/utils/src/index.ts";

const STRICT_MAIN_DECK_SIZE = 40;
const MAX_COPIES = 3;

export type DeckSource = "test" | "real-single" | "print-and-play-padded" | "legal-permutations";

export interface GeneratedDeck {
  id: string;
  archetype: string;
  legends: string[];
  mainDeck: string[];
  coveredSlugs: string[];
}

export interface DeckCoverageSummary {
  covered: number;
  missed: number;
  totalReachable: number;
  missedSlugs: string[];
}

export interface DeckPool {
  decks: GeneratedDeck[];
  coverage: DeckCoverageSummary;
}

interface BuildPool {
  legends: CardDefinition[];
  nonLegends: CardDefinition[];
  bySlug: Map<string, CardDefinition>;
}

interface ScoredCard {
  card: CardDefinition;
  score: number;
}

export function createStructuredCatalog(): CardCatalog {
  const map = new Map<string, CardDefinition>();
  for (const card of structuredCards as CardDefinition[]) {
    map.set(card.slug, card);
    map.set(card.id, card);
  }
  return {
    get(slug) {
      return map.get(slug);
    },
    *entries() {
      yield* map.entries();
    },
    get size() {
      return map.size;
    },
  };
}

export function createLegalDeckPool(source: DeckSource): DeckPool {
  const pool = buildPool();
  if (source === "real-single") {
    const deck = buildArchetypeDeck(pool, "real-single", "real-single", (cards) =>
      cards.map((card, index) => ({ card, score: cards.length - index })),
    );
    return summarizePool(pool, [deck]);
  }

  const printAndPlay = createPrintAndPlayPaddedDecks(pool);
  if (source === "print-and-play-padded") {
    return summarizePool(pool, printAndPlay);
  }

  const decks: GeneratedDeck[] = [...printAndPlay];
  decks.push(
    buildArchetypeDeck(pool, "low-curve", "low-curve", (cards) =>
      cards.map((card) => ({ card, score: 100 - cardCost(card) })),
    ),
  );
  decks.push(
    buildArchetypeDeck(pool, "high-power", "high-power", (cards) =>
      cards.map((card) => ({ card, score: cardPower(card) * 10 - cardCost(card) })),
    ),
  );
  decks.push(
    buildArchetypeDeck(pool, "sell-heavy", "sell-heavy", (cards) =>
      cards.map((card) => ({ card, score: (card.hasSellTag ? 100 : 0) - cardCost(card) })),
    ),
  );
  decks.push(
    buildArchetypeDeck(pool, "keyword-heavy", "keyword-heavy", (cards) =>
      cards.map((card) => ({ card, score: card.keywords.length * 100 + cardPower(card) })),
    ),
  );
  decks.push(
    buildArchetypeDeck(pool, "program-heavy", "program-heavy", (cards) =>
      cards.map((card) => ({ card, score: (card.type === "program" ? 100 : 0) - cardCost(card) })),
    ),
  );
  decks.push(
    buildArchetypeDeck(pool, "gear-heavy", "gear-heavy", (cards) =>
      cards.map((card) => ({ card, score: (card.type === "gear" ? 100 : 0) + cardPower(card) })),
    ),
  );
  decks.push(buildSetBalancedDeck(pool));
  decks.push(...buildGreedySetCoverDecks(pool, decks));
  return summarizePool(pool, decks);
}

export function deckListFromGenerated(deck: GeneratedDeck, playerId: string): DeckList {
  return {
    playerId,
    playerName: `Player ${playerId}`,
    legends: deck.legends,
    mainDeck: deck.mainDeck,
  };
}

export function assertGeneratedDeckIsStrictlyLegal(deck: GeneratedDeck): void {
  const pool = buildPool();
  assertStrictDeck(pool, deck);
}

export function summarizeDeckCoverage(decks: GeneratedDeck[]): DeckCoverageSummary {
  return summarizeCoverage(buildPool(), decks);
}

function buildPool(): BuildPool {
  const bySlug = new Map<string, CardDefinition>();
  for (const card of [...(structuredCards as CardDefinition[])].sort(compareCard)) {
    if (!bySlug.has(card.slug)) bySlug.set(card.slug, card);
  }
  const cards = [...bySlug.values()];
  return {
    legends: cards.filter((card) => card.type === "legend").sort(compareCard),
    nonLegends: cards.filter((card) => card.type !== "legend").sort(compareCard),
    bySlug,
  };
}

function createPrintAndPlayPaddedDecks(pool: BuildPool): GeneratedDeck[] {
  return deckLists.map((raw, index) => {
    const parsed = parsePrintAndPlay(raw);
    const legends = parsed.legends.map((name) => findByName(pool.legends, name));
    const main: CardDefinition[] = [];
    for (const entry of parsed.mainDeck) {
      const card = findByName(pool.nonLegends, entry.name);
      for (let i = 0; i < entry.count; i++) main.push(card);
    }
    const id = index === 0 ? "print-and-play-arasaka-padded" : "print-and-play-merc-padded";
    return makeDeck(pool, id, "print-and-play-padded", legends, main, legalCardsFor(pool, legends));
  });
}

function buildArchetypeDeck(
  pool: BuildPool,
  id: string,
  archetype: string,
  scorer: (cards: CardDefinition[]) => ScoredCard[],
): GeneratedDeck {
  const legends = bestLegendLineup(pool.nonLegends, pool.legends);
  const legal = legalCardsFor(pool, legends);
  const prioritized = scorer(legal)
    .sort((a, b) => b.score - a.score || compareCard(a.card, b.card))
    .map((entry) => entry.card);
  return makeDeck(pool, id, archetype, legends, prioritized, legal);
}

function buildSetBalancedDeck(pool: BuildPool): GeneratedDeck {
  const legends = bestLegendLineup(pool.nonLegends, pool.legends);
  const legal = legalCardsFor(pool, legends);
  const bySet = new Map<string, CardDefinition[]>();
  for (const card of legal) {
    const setCode = card.set.code;
    const list = bySet.get(setCode) ?? [];
    list.push(card);
    bySet.set(setCode, list);
  }
  for (const list of bySet.values()) list.sort(compareCard);

  const prioritized: CardDefinition[] = [];
  const setCodes = [...bySet.keys()].sort();
  let added = true;
  while (added) {
    added = false;
    for (const setCode of setCodes) {
      const next = bySet.get(setCode)?.shift();
      if (next) {
        prioritized.push(next);
        added = true;
      }
    }
  }
  return makeDeck(pool, "set-balanced", "set-balanced", legends, prioritized, legal);
}

function buildGreedySetCoverDecks(pool: BuildPool, existing: GeneratedDeck[]): GeneratedDeck[] {
  const covered = new Set(existing.flatMap((deck) => deck.coveredSlugs));
  const decks: GeneratedDeck[] = [];
  let iteration = 0;

  while (true) {
    const missed = pool.nonLegends.filter((card) => !covered.has(card.slug));
    if (missed.length === 0) return decks;
    const legends = bestLegendLineup(missed, pool.legends);
    const legal = legalCardsFor(pool, legends);
    const prioritized = [
      ...missed.filter((card) => legal.some((candidate) => candidate.slug === card.slug)),
      ...legal,
    ];
    if (prioritized.length === 0) return decks;
    const deck = makeDeck(
      pool,
      `greedy-set-cover-${iteration + 1}`,
      "greedy-set-cover",
      legends,
      prioritized,
      legal,
    );
    const newCoverage = deck.coveredSlugs.filter((slug) => !covered.has(slug));
    if (newCoverage.length === 0) return decks;
    decks.push(deck);
    for (const slug of newCoverage) covered.add(slug);
    iteration++;
  }
}

function makeDeck(
  pool: BuildPool,
  id: string,
  archetype: string,
  legends: CardDefinition[],
  prioritized: CardDefinition[],
  fillers: CardDefinition[],
): GeneratedDeck {
  const mainDeck: string[] = [];
  const counts = new Map<string, number>();
  const add = (card: CardDefinition): boolean => {
    if (mainDeck.length >= STRICT_MAIN_DECK_SIZE) return false;
    if (card.type === "legend") return false;
    if (!isLegalWithLegends(card, legends)) return false;
    const count = counts.get(card.slug) ?? 0;
    if (count >= MAX_COPIES) return false;
    mainDeck.push(card.slug);
    counts.set(card.slug, count + 1);
    return true;
  };

  for (const card of prioritized) add(card);
  const legalFillers = dedupeCards(fillers).filter((card) => isLegalWithLegends(card, legends));
  let cursor = 0;
  while (mainDeck.length < STRICT_MAIN_DECK_SIZE && legalFillers.length > 0) {
    const before = mainDeck.length;
    for (let i = 0; i < legalFillers.length && mainDeck.length < STRICT_MAIN_DECK_SIZE; i++) {
      add(legalFillers[(cursor + i) % legalFillers.length]!);
    }
    cursor++;
    if (mainDeck.length === before) break;
  }

  const deck: GeneratedDeck = {
    id,
    archetype,
    legends: legends.map((card) => card.slug),
    mainDeck,
    coveredSlugs: [...new Set(mainDeck)].sort(),
  };
  assertStrictDeck(pool, deck);
  return deck;
}

function assertStrictDeck(pool: BuildPool, deck: GeneratedDeck): void {
  const legends = deck.legends.map((slug) => requiredCard(pool, slug));
  const mainDeck = deck.mainDeck.map((slug) => requiredCard(pool, slug));
  const errors = validateDeck(legends, mainDeck);
  if (deck.legends.length !== 3 || new Set(deck.legends).size !== 3) {
    errors.push({ code: "INVALID_LEGEND_COUNT", message: "Deck must have 3 unique legend slugs" });
  }
  if (deck.mainDeck.length !== STRICT_MAIN_DECK_SIZE) {
    errors.push({
      code: "INVALID_DECK_SIZE",
      message: `Strict runner decks must have exactly ${STRICT_MAIN_DECK_SIZE} main-deck cards`,
    });
  }
  if (errors.length > 0) {
    throw new Error(`${deck.id} is not legal: ${errors.map((e) => e.message).join("; ")}`);
  }
}

function summarizePool(pool: BuildPool, decks: GeneratedDeck[]): DeckPool {
  return {
    decks,
    coverage: summarizeCoverage(pool, decks),
  };
}

function summarizeCoverage(pool: BuildPool, decks: GeneratedDeck[]): DeckCoverageSummary {
  const covered = new Set(decks.flatMap((deck) => deck.coveredSlugs));
  const missedSlugs = pool.nonLegends
    .map((card) => card.slug)
    .filter((slug) => !covered.has(slug))
    .sort();
  return {
    covered: pool.nonLegends.length - missedSlugs.length,
    missed: missedSlugs.length,
    totalReachable: pool.nonLegends.length,
    missedSlugs,
  };
}

function bestLegendLineup(
  targetCards: CardDefinition[],
  legends: CardDefinition[],
): CardDefinition[] {
  let best: CardDefinition[] | undefined;
  let bestScore = -1;
  for (let a = 0; a < legends.length; a++) {
    for (let b = a + 1; b < legends.length; b++) {
      for (let c = b + 1; c < legends.length; c++) {
        const lineup = [legends[a]!, legends[b]!, legends[c]!];
        if (new Set(lineup.map((card) => card.name)).size !== 3) continue;
        const score = targetCards.filter((card) => isLegalWithLegends(card, lineup)).length;
        if (score > bestScore) {
          best = lineup;
          bestScore = score;
        }
      }
    }
  }
  if (!best) throw new Error("Need at least one 3-distinct-legend lineup");
  return best;
}

function legalCardsFor(pool: BuildPool, legends: CardDefinition[]): CardDefinition[] {
  return pool.nonLegends.filter((card) => isLegalWithLegends(card, legends));
}

function isLegalWithLegends(card: CardDefinition, legends: CardDefinition[]): boolean {
  const budget = legends
    .filter((legend) => legend.type === "legend" && legend.color === card.color)
    .reduce((sum, legend) => sum + (legend.ram ?? 0), 0);
  return budget >= (card.ram ?? 0);
}

function requiredCard(pool: BuildPool, slug: string): CardDefinition {
  const card = pool.bySlug.get(slug);
  if (!card) throw new Error(`Unknown card slug in generated deck: ${slug}`);
  return card;
}

function parsePrintAndPlay(raw: string): {
  legends: string[];
  mainDeck: Array<{ count: number; name: string }>;
} {
  const legends: string[] = [];
  const mainDeck: Array<{ count: number; name: string }> = [];
  let section: "none" | "legends" | "main" = "none";
  for (const line of raw
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean)) {
    if (line === "Legends") {
      section = "legends";
      continue;
    }
    if (line.startsWith("Main Deck")) {
      section = "main";
      continue;
    }
    const match = /^(\d+)\s+(.+)$/.exec(line);
    if (!match) continue;
    const count = Number.parseInt(match[1]!, 10);
    const name = match[2]!;
    if (section === "legends") legends.push(name);
    if (section === "main") mainDeck.push({ count, name });
  }
  return { legends, mainDeck };
}

function findByName(cards: CardDefinition[], rawName: string): CardDefinition {
  const normalized = normalizeName(rawName);
  const exact = cards.find(
    (card) =>
      normalizeName(card.displayName) === normalized || normalizeName(card.name) === normalized,
  );
  if (exact) return exact;
  const prefix = cards.find(
    (card) =>
      normalizeName(card.displayName).startsWith(`${normalized} `) ||
      normalizeName(card.name).startsWith(`${normalized} `),
  );
  if (prefix) return prefix;
  throw new Error(`Could not find print-and-play card by name: ${rawName}`);
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

function dedupeCards(cards: CardDefinition[]): CardDefinition[] {
  const seen = new Set<string>();
  const out: CardDefinition[] = [];
  for (const card of cards) {
    if (seen.has(card.slug)) continue;
    seen.add(card.slug);
    out.push(card);
  }
  return out;
}

function compareCard(a: CardDefinition, b: CardDefinition): number {
  return a.slug.localeCompare(b.slug);
}

function cardCost(card: CardDefinition): number {
  return card.type === "legend" ? 0 : card.cost;
}

function cardPower(card: CardDefinition): number {
  return card.type === "unit" || card.type === "gear" ? card.power : 0;
}
