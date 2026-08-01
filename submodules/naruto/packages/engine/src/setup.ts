/**
 * Deck building/validation and initial game state construction.
 *
 * Deck legality: exactly 50 cards, leader required, characters/EX only, all
 * cards match the leader's color (or are colorless), max 4 copies per card.
 */

import { getAllCards, getCardById } from "@tcg-engines/naruto-cards";
import type { CardDefinition } from "@tcg-engines/naruto-cards";

import { pushLog } from "./log";
import { random, shuffle } from "./rng";
import { OFFICIAL_RULES, PROVISIONAL_RULES } from "./rules";
import { startTurn } from "./reducer";
import type {
  CardInstance,
  GameState,
  PlayerId,
  PlayerState,
} from "./types";

export interface DeckList {
  readonly leaderId: string;
  readonly cardIds: readonly string[];
}

export type DeckIssue =
  | "noLeader"
  | "unknownLeader"
  | "wrongSize"
  | "notACharacter"
  | "wrongColor"
  | "tooManyCopies";

export function playableLeaders(): readonly CardDefinition[] {
  return getAllCards().filter((c) => c.cardType === "leader");
}

/** Character/EX pool matching the leader's color (plus colorless). */
export function poolForLeader(leaderId: string): readonly CardDefinition[] {
  const leader = getAllCards().find((c) => c.id === leaderId);
  if (!leader) return [];
  return getAllCards().filter(
    (c) =>
      (c.cardType === "character" || c.cardType === "ex_character") &&
      (c.color === leader.color || c.color === ""),
  );
}

export function deckCounts(cardIds: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const id of cardIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  return counts;
}

export function expandCounts(counts: ReadonlyMap<string, number> | Record<string, number>): string[] {
  const entries = counts instanceof Map ? [...counts.entries()] : Object.entries(counts);
  const ids: string[] = [];
  for (const [id, count] of entries) {
    for (let i = 0; i < count; i += 1) ids.push(id);
  }
  return ids;
}

export function deckIssues(deck: DeckList): DeckIssue[] {
  const issues: DeckIssue[] = [];
  if (!deck.leaderId) {
    issues.push("noLeader");
    return issues;
  }
  const leader = getCardById(deck.leaderId);
  if (!leader || leader.cardType !== "leader") {
    issues.push("unknownLeader");
    return issues;
  }
  if (deck.cardIds.length !== OFFICIAL_RULES.deckSize) issues.push("wrongSize");
  for (const cardId of deck.cardIds) {
    const card = getCardById(cardId);
    if (!card || (card.cardType !== "character" && card.cardType !== "ex_character")) {
      if (!issues.includes("notACharacter")) issues.push("notACharacter");
      continue;
    }
    if (card.color !== leader.color && card.color !== "" && !issues.includes("wrongColor")) {
      issues.push("wrongColor");
    }
  }
  const limit = PROVISIONAL_RULES.maxCopiesPerCard;
  if (limit !== null) {
    for (const count of deckCounts(deck.cardIds).values()) {
      if (count > limit) {
        issues.push("tooManyCopies");
        break;
      }
    }
  }
  return issues;
}

export function isLegalDeck(deck: DeckList): boolean {
  return deckIssues(deck).length === 0;
}

export function copyLimit(): number {
  return PROVISIONAL_RULES.maxCopiesPerCard ?? OFFICIAL_RULES.deckSize;
}

/** Auto-build a legal 50-card deck for a leader by cycling its card pool. */
export function buildDeck(leaderId: string): DeckList {
  const pool = poolForLeader(leaderId);
  if (pool.length === 0) return { leaderId, cardIds: [] };
  const cardIds: string[] = [];
  let i = 0;
  while (cardIds.length < OFFICIAL_RULES.deckSize) {
    const card = pool[i % pool.length];
    if (card) cardIds.push(card.id);
    i += 1;
  }
  return { leaderId, cardIds };
}

function totalOf(counts: ReadonlyMap<string, number>): number {
  let total = 0;
  for (const count of counts.values()) total += count;
  return total;
}

/** Drop illegal cards/copies, then top up from the leader's pool to 50. */
export function repairDeck(deck: DeckList): DeckList {
  const leader = getCardById(deck.leaderId);
  if (!leader || leader.cardType !== "leader") return deck;
  const legal = new Set(poolForLeader(deck.leaderId).map((c) => c.id));
  const limit = copyLimit();
  const counts = new Map<string, number>();
  for (const id of deck.cardIds) {
    if (!legal.has(id)) continue;
    const have = counts.get(id) ?? 0;
    if (have >= limit) continue;
    if (totalOf(counts) >= OFFICIAL_RULES.deckSize) break;
    counts.set(id, have + 1);
  }
  for (const card of poolForLeader(deck.leaderId)) {
    while (totalOf(counts) < OFFICIAL_RULES.deckSize && (counts.get(card.id) ?? 0) < limit) {
      counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
    }
    if (totalOf(counts) >= OFFICIAL_RULES.deckSize) break;
  }
  return { leaderId: deck.leaderId, cardIds: expandCounts(counts) };
}

export interface PrebuiltDeck {
  readonly key: string;
  readonly leaderId: string;
  readonly counts: Readonly<Record<string, number>>;
}

export const PREBUILT_DECKS: readonly PrebuiltDeck[] = [
  {
    key: "teamTen",
    leaderId: "N-001",
    counts: {
      "N-011": 4,
      "N-008": 4,
      "N-choji": 4,
      "N-004": 4,
      "K-039": 4,
      "N-hinata": 4,
      "N-006": 4,
      "N-007": 4,
      "N-005": 3,
      "N-naruto-ex": 3,
      "N-reveal-09": 4,
      "N-reveal-04": 4,
      "N-reveal-02": 4,
    },
  },
  {
    key: "mountMyoboku",
    leaderId: "N-001",
    counts: {
      "N-005": 4,
      "N-naruto-ex": 4,
      "N-004": 4,
      "N-006": 4,
      "N-007": 4,
      "K-039": 4,
      "N-008": 4,
      "N-011": 4,
      "N-choji": 3,
      "N-hinata": 3,
      "N-reveal-08": 4,
      "N-reveal-05": 4,
      "N-reveal-04": 4,
    },
  },
  {
    key: "theTaka",
    leaderId: "N-012",
    counts: {
      "N-010": 4,
      "N-019": 4,
      "N-021": 4,
      "N-014": 4,
      "N-015": 4,
      "N-013": 4,
      "N-016": 4,
      "N-sakura": 4,
      "N-orochimaru": 3,
      "N-022": 3,
      "N-reveal-07": 4,
      "N-reveal-03": 4,
      "N-reveal-01": 4,
    },
  },
  {
    key: "uchihaIllusion",
    leaderId: "N-012",
    counts: {
      "N-013": 4,
      "N-016": 4,
      "N-015": 4,
      "N-014": 4,
      "N-orochimaru": 4,
      "N-sakura": 4,
      "N-022": 4,
      "N-010": 4,
      "N-019": 3,
      "N-021": 3,
      "N-reveal-06": 4,
      "N-reveal-03": 4,
      "N-reveal-01": 4,
    },
  },
] as const;

export function prebuiltDeckList(deck: PrebuiltDeck): DeckList {
  return { leaderId: deck.leaderId, cardIds: expandCounts(deck.counts) };
}

export function randomPrebuilt(roll: number): PrebuiltDeck {
  const index = Math.abs(Math.floor(roll * PREBUILT_DECKS.length)) % PREBUILT_DECKS.length;
  return PREBUILT_DECKS[index] as PrebuiltDeck;
}

/** Default prebuilt matchup: first two leaders, auto-built decks, optionally swapped. */
export function defaultMatchup(swap = false): { p1: DeckList; p2: DeckList } {
  const leaders = playableLeaders();
  const first = leaders[0]?.id ?? "";
  const second = leaders[1]?.id ?? first;
  return swap
    ? { p1: buildDeck(second), p2: buildDeck(first) }
    : { p1: buildDeck(first), p2: buildDeck(second) };
}

export function createInstances(cardIds: readonly string[], prefix: string): CardInstance[] {
  return cardIds.map((cardId, i) => ({ uid: `${prefix}-${i}-${cardId}`, cardId }));
}

export function emptySlots(count: number): null[] {
  return Array.from({ length: count }, () => null);
}

export interface PlayerSetup {
  readonly player: PlayerState;
  readonly seed: number;
}

/** Build a player's starting state: shuffled deck (seeded), opening hand drawn. */
export function createPlayerInstances(
  id: PlayerId,
  name: string,
  leaderId: string,
  cardIds: readonly string[],
  seed: number,
): PlayerSetup {
  const shuffled = shuffle(createInstances(cardIds, id), seed);
  const player: PlayerState = {
    id,
    name,
    leaderId,
    life: OFFICIAL_RULES.leaderLife,
    leaderRested: false,
    leaderAttacksUsed: 0,
    leaderCannotAttackUntilTurn: 0,
    deck: shuffled.items,
    hand: [],
    trash: [],
    characters: emptySlots(PROVISIONAL_RULES.characterSlotsShown),
    supports: emptySlots(OFFICIAL_RULES.supportSlots),
    chakra: Array.from({ length: OFFICIAL_RULES.chakraCount }, (_, i) => ({
      uid: `${id}-chakra-${i}`,
      faceUp: true,
    })),
    summonRested: false,
    exPile: [],
    summonsUsedThisTurn: 0,
    leaderUsedThisTurn: false,
    mulliganDone: false,
    chakraLockedUntilTurn: 0,
  };
  for (let i = 0; i < PROVISIONAL_RULES.openingHand; i += 1) {
    const card = player.deck.shift();
    if (card) player.hand.push(card);
  }
  return { player, seed: shuffled.seed };
}

export interface GameConfig {
  readonly decks?: { readonly p1?: DeckList; readonly p2?: DeckList };
  readonly leaders?: { readonly p1?: string; readonly p2?: string };
  readonly firstPlayer?: PlayerId;
  readonly seed?: number;
  readonly names?: { readonly p1?: string; readonly p2?: string };
}

export const DEFAULT_SEED = 0x1354c15;

/**
 * Build a fresh game. Shuffles both decks (seeded), draws opening hands,
 * gives the 2nd player a mulligan window (or starts turn 1 immediately).
 */
export function createInitialState(config: GameConfig = {}): GameState {
  let seed = config.seed ?? DEFAULT_SEED;
  const matchupRoll = random(seed);
  seed = matchupRoll.seed;
  const matchup = defaultMatchup(matchupRoll.value < 0.5);

  const deckP1 =
    config.decks?.p1 ?? (config.leaders?.p1 ? buildDeck(config.leaders.p1) : matchup.p1);
  const deckP2 =
    config.decks?.p2 ?? (config.leaders?.p2 ? buildDeck(config.leaders.p2) : matchup.p2);

  const p1 = createPlayerInstances("p1", config.names?.p1 ?? "P1", deckP1.leaderId, deckP1.cardIds, seed);
  seed = p1.seed;
  const p2 = createPlayerInstances("p2", config.names?.p2 ?? "P2", deckP2.leaderId, deckP2.cardIds, seed);
  seed = p2.seed;

  const firstRoll = random(seed);
  seed = firstRoll.seed;
  const activePlayer = config.firstPlayer ?? (firstRoll.value < 0.5 ? "p1" : "p2");

  const state: GameState = {
    turn: 1,
    activePlayer,
    phase: "refresh",
    step: "normal",
    priority: null,
    pendingAttack: null,
    pendingChoice: null,
    chain: [],
    resolvingSupport: null,
    consecutivePasses: 0,
    awaitingMulligan: PROVISIONAL_RULES.mulliganForSecondPlayer
      ? activePlayer === "p1"
        ? "p2"
        : "p1"
      : null,
    winner: null,
    seed,
    log: [],
    players: { p1: p1.player, p2: p2.player },
  };
  pushLog(state, "system", "log.gameStart");
  if (!state.awaitingMulligan) startTurn(state);
  return state;
}
