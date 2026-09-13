/**
 * Deck building/validation and initial game state construction.
 *
 * Preview deck legality: exactly 50 main-deck cards plus a separate Leader,
 * five identified Chakra cards, and one identified Summon card. Character/EX
 * cards match the Leader's color. Copy limits are intentionally provisional.
 */

import { getAllCards, getCardById } from "@tcg-engines/naruto-cards";
import type { CardDefinition } from "@tcg-engines/naruto-cards";

import { pushLog } from "./log";
import { random, shuffle } from "./rng";
import {
  CONFIRMED_STRUCTURAL_RULES,
  NARUTO_PREVIEW_RULES_PROFILE,
  PROVISIONAL_RULES,
} from "./rules";
import { startTurn } from "./reducer";
import { drawCards } from "./state-ops";
import type { CardInstance, GameState, PlayerId, PlayerState } from "./types";

export interface DeckList {
  readonly leaderId: string;
  readonly cardIds: readonly string[];
  /** Exactly five Chakra card ids. Their concrete snapshot identities are not official data. */
  readonly chakraCardIds: readonly string[];
  /** Exactly one Summon card id. Its concrete snapshot identity is not official data. */
  readonly summonCardId: string;
}

export type DeckIssue =
  | "noLeader"
  | "unknownLeader"
  | "wrongSize"
  | "notACharacter"
  | "wrongColor"
  | "tooManyCopies"
  | "wrongChakraCount"
  | "unknownChakra"
  | "notAChakra"
  | "noSummon"
  | "unknownSummon"
  | "notASummon";

/**
 * Side-card identities selected from the unverified card snapshot for the
 * Preview defaults. The 5 Chakra / 1 Summon counts are structural facts; the
 * concrete card ids are not represented as official deck data.
 */
export const PREVIEW_CHAKRA_CARD_IDS = ["C-001", "C-001", "C-001", "C-001", "C-001"] as const;
export const PREVIEW_SUMMON_CARD_ID = "S-001" as const;

function previewSideCards(): Pick<DeckList, "chakraCardIds" | "summonCardId"> {
  return {
    chakraCardIds: [...PREVIEW_CHAKRA_CARD_IDS],
    summonCardId: PREVIEW_SUMMON_CARD_ID,
  };
}

export function playableLeaders(): readonly CardDefinition[] {
  return getAllCards().filter((c) => c.cardType === "leader");
}

/** Character/EX pool matching the Leader's color. */
export function poolForLeader(leaderId: string): readonly CardDefinition[] {
  const leader = getAllCards().find((c) => c.id === leaderId);
  if (!leader) return [];
  return getAllCards().filter(
    (c) =>
      (c.cardType === "character" || c.cardType === "ex_character") && c.color === leader.color,
  );
}

export function deckCounts(cardIds: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const id of cardIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  return counts;
}

export function expandCounts(
  counts: ReadonlyMap<string, number> | Record<string, number>,
): string[] {
  const entries = counts instanceof Map ? [...counts.entries()] : Object.entries(counts);
  const ids: string[] = [];
  for (const [id, count] of entries) {
    for (let i = 0; i < count; i += 1) ids.push(id);
  }
  return ids;
}

export function deckIssues(deck: DeckList): DeckIssue[] {
  const issues = [...practiceDeckIssues(deck)];
  const leader = getCardById(deck.leaderId);
  if (!leader || leader.cardType !== "leader") return issues;
  if (deck.cardIds.length !== PROVISIONAL_RULES.mainDeckSize) issues.push("wrongSize");
  for (const cardId of deck.cardIds) {
    const card = getCardById(cardId);
    if (
      card &&
      (card.cardType === "character" || card.cardType === "ex_character") &&
      card.color !== leader.color &&
      !issues.includes("wrongColor")
    ) {
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

/**
 * Runtime-safety validation for local practice. It intentionally omits the
 * provisional main-deck size, Leader-color, and copy-limit rules while still
 * rejecting identities or card types that cannot construct engine state.
 */
export function practiceDeckIssues(deck: DeckList): DeckIssue[] {
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
  for (const cardId of deck.cardIds) {
    const card = getCardById(cardId);
    if (!card || (card.cardType !== "character" && card.cardType !== "ex_character")) {
      if (!issues.includes("notACharacter")) issues.push("notACharacter");
    }
  }
  if (deck.chakraCardIds.length !== CONFIRMED_STRUCTURAL_RULES.chakraCount) {
    issues.push("wrongChakraCount");
  }
  for (const cardId of deck.chakraCardIds) {
    const card = getCardById(cardId);
    if (!card) {
      if (!issues.includes("unknownChakra")) issues.push("unknownChakra");
    } else if (card.cardType !== "chakra" && !issues.includes("notAChakra")) {
      issues.push("notAChakra");
    }
  }
  if (!deck.summonCardId) {
    issues.push("noSummon");
  } else {
    const summon = getCardById(deck.summonCardId);
    if (!summon) issues.push("unknownSummon");
    else if (summon.cardType !== "summon") issues.push("notASummon");
  }
  return issues;
}

export function isLegalDeck(deck: DeckList): boolean {
  return deckIssues(deck).length === 0;
}

export function copyLimit(): number {
  return PROVISIONAL_RULES.maxCopiesPerCard ?? PROVISIONAL_RULES.mainDeckSize;
}

/** Auto-build a legal 50-card main deck for a Preview Leader. */
export function buildDeck(leaderId: string): DeckList {
  const pool = poolForLeader(leaderId);
  if (pool.length === 0) return { leaderId, cardIds: [], ...previewSideCards() };
  const cardIds: string[] = [];
  const counts = new Map<string, number>();
  const limit = copyLimit();
  let i = 0;
  while (cardIds.length < PROVISIONAL_RULES.mainDeckSize) {
    const card = pool[i % pool.length];
    if (card && (counts.get(card.id) ?? 0) < limit) {
      cardIds.push(card.id);
      counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
    }
    i += 1;
    if (i > pool.length * limit && cardIds.length < PROVISIONAL_RULES.mainDeckSize) {
      return { leaderId, cardIds: [], ...previewSideCards() };
    }
  }
  return { leaderId, cardIds, ...previewSideCards() };
}

function totalOf(counts: ReadonlyMap<string, number>): number {
  let total = 0;
  for (const count of counts.values()) total += count;
  return total;
}

/** Drop illegal cards/copies, then top up the 50-card Preview main deck. */
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
    if (totalOf(counts) >= PROVISIONAL_RULES.mainDeckSize) break;
    counts.set(id, have + 1);
  }
  for (const card of poolForLeader(deck.leaderId)) {
    while (totalOf(counts) < PROVISIONAL_RULES.mainDeckSize && (counts.get(card.id) ?? 0) < limit) {
      counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
    }
    if (totalOf(counts) >= PROVISIONAL_RULES.mainDeckSize) break;
  }
  const chakraCardIds = deck.chakraCardIds
    .filter((cardId) => getCardById(cardId)?.cardType === "chakra")
    .slice(0, CONFIRMED_STRUCTURAL_RULES.chakraCount);
  while (chakraCardIds.length < CONFIRMED_STRUCTURAL_RULES.chakraCount) {
    chakraCardIds.push(PREVIEW_CHAKRA_CARD_IDS[0]);
  }
  const summonCardId =
    getCardById(deck.summonCardId)?.cardType === "summon"
      ? deck.summonCardId
      : PREVIEW_SUMMON_CARD_ID;
  return { leaderId: deck.leaderId, cardIds: expandCounts(counts), chakraCardIds, summonCardId };
}

/** A curated deck for the provisional Preview profile. */
export interface PreviewDeck {
  readonly key: string;
  readonly leaderId: string;
  readonly counts: Readonly<Record<string, number>>;
  /** Snapshot-selected side cards for this Preview deck, not official deck data. */
  readonly chakraCardIds: readonly string[];
  readonly summonCardId: string;
}

export const PREVIEW_DECKS: readonly PreviewDeck[] = [
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
    chakraCardIds: PREVIEW_CHAKRA_CARD_IDS,
    summonCardId: PREVIEW_SUMMON_CARD_ID,
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
    chakraCardIds: PREVIEW_CHAKRA_CARD_IDS,
    summonCardId: PREVIEW_SUMMON_CARD_ID,
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
    chakraCardIds: PREVIEW_CHAKRA_CARD_IDS,
    summonCardId: PREVIEW_SUMMON_CARD_ID,
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
    chakraCardIds: PREVIEW_CHAKRA_CARD_IDS,
    summonCardId: PREVIEW_SUMMON_CARD_ID,
  },
] as const;

export function previewDeckList(deck: PreviewDeck): DeckList {
  return {
    leaderId: deck.leaderId,
    cardIds: expandCounts(deck.counts),
    chakraCardIds: [...deck.chakraCardIds],
    summonCardId: deck.summonCardId,
  };
}

export function randomPreviewDeck(roll: number): PreviewDeck {
  const index = Math.abs(Math.floor(roll * PREVIEW_DECKS.length)) % PREVIEW_DECKS.length;
  return PREVIEW_DECKS[index] as PreviewDeck;
}

/** Default Preview matchup: first two leaders, auto-built decks, optionally swapped. */
export function defaultPreviewMatchup(swap = false): { p1: DeckList; p2: DeckList } {
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

/** Build a player's starting state with a seeded, full main deck. */
export function createPlayerInstances(
  id: PlayerId,
  name: string,
  deck: DeckList,
  seed: number,
): PlayerSetup {
  return createPlayerInstancesWithValidation(id, name, deck, seed, deckIssues);
}

/** Build a practice player while enforcing only runtime-safe deck structure. */
export function createPracticePlayerInstances(
  id: PlayerId,
  name: string,
  deck: DeckList,
  seed: number,
): PlayerSetup {
  return createPlayerInstancesWithValidation(id, name, deck, seed, practiceDeckIssues);
}

function createPlayerInstancesWithValidation(
  id: PlayerId,
  name: string,
  deck: DeckList,
  seed: number,
  validate: (deck: DeckList) => DeckIssue[],
): PlayerSetup {
  const issues = validate(deck);
  if (issues.length > 0) {
    throw new Error(`Invalid Preview deck for ${id}: ${issues.join(", ")}`);
  }
  const shuffled = shuffle(createInstances(deck.cardIds, id), seed);
  const player: PlayerState = {
    id,
    name,
    leaderId: deck.leaderId,
    life: PROVISIONAL_RULES.startingLeaderLife,
    leaderRested: false,
    leaderAttacksUsed: 0,
    leaderCannotAttackUntilTurn: 0,
    deck: shuffled.items,
    hand: [],
    trash: [],
    characters: emptySlots(PROVISIONAL_RULES.characterSlotsShown),
    supports: emptySlots(PROVISIONAL_RULES.supportSlots),
    chakra: deck.chakraCardIds.map((cardId, i) => ({
      uid: `${id}-chakra-${i}-${cardId}`,
      cardId,
      faceUp: true,
    })),
    summon: {
      uid: `${id}-summon-${deck.summonCardId}`,
      cardId: deck.summonCardId,
      rested: false,
    },
    exPile: [],
    summonsUsedThisTurn: 0,
    leaderUsedThisTurn: false,
    mulliganDone: false,
    chakraLockedUntilTurn: 0,
  };
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
  return createState(config, createPlayerInstances);
}

/**
 * Build a local practice game from a runtime-safe deck. Matchmaking and the
 * server adapter continue to call strict `createInitialState`.
 */
export function createPracticeState(config: GameConfig = {}): GameState {
  return createState(config, createPracticePlayerInstances);
}

function createState(
  config: GameConfig,
  createPlayer: (id: PlayerId, name: string, deck: DeckList, seed: number) => PlayerSetup,
): GameState {
  let seed = config.seed ?? DEFAULT_SEED;
  const matchupRoll = random(seed);
  seed = matchupRoll.seed;
  const matchup = defaultPreviewMatchup(matchupRoll.value < 0.5);

  const deckP1 =
    config.decks?.p1 ?? (config.leaders?.p1 ? buildDeck(config.leaders.p1) : matchup.p1);
  const deckP2 =
    config.decks?.p2 ?? (config.leaders?.p2 ? buildDeck(config.leaders.p2) : matchup.p2);

  const p1 = createPlayer("p1", config.names?.p1 ?? "P1", deckP1, seed);
  seed = p1.seed;
  const p2 = createPlayer("p2", config.names?.p2 ?? "P2", deckP2, seed);
  seed = p2.seed;

  const firstRoll = random(seed);
  seed = firstRoll.seed;
  const activePlayer = config.firstPlayer ?? (firstRoll.value < 0.5 ? "p1" : "p2");

  const state: GameState = {
    rulesProfile: NARUTO_PREVIEW_RULES_PROFILE,
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
  // Opening hands are mandatory draws, so use the shared deck-out-aware path
  // even though strict 50-card setup makes deck-out unreachable here.
  drawCards(state, "p1", PROVISIONAL_RULES.openingHand);
  if (!state.winner) drawCards(state, "p2", PROVISIONAL_RULES.openingHand);
  if (!state.awaitingMulligan && !state.winner) startTurn(state);
  return state;
}
