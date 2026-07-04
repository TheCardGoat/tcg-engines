import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { createMatch } from "../engine/match.ts";
import type { CardZone, MatchConfig, MatchSeat, MatchState } from "../types.ts";
import type { OPCard } from "@tcg/op-types";

export type CardRef = string | Pick<OPCard, "id">;

export type FixtureCardEntry = CardRef | FixtureCardState;

export type FixtureCardState = (
  | {
      cardId: string;
      card?: never;
    }
  | {
      card: Pick<OPCard, "id">;
      cardId?: never;
    }
) & {
  rested?: boolean;
  attachedDon?: number;
  playedOnTurn?: number | null;
  faceUp?: boolean;
  publicKnowledge?: boolean;
};

interface MaterializedFixtureCardState {
  cardId: string;
  rested?: boolean;
  attachedDon?: number;
  playedOnTurn?: number | null;
  faceUp?: boolean;
  publicKnowledge?: boolean;
}

export interface PlayerFixture {
  leaderCardId?: CardRef;
  hand?: number | FixtureCardEntry[];
  deck?: number | FixtureCardEntry[];
  life?: number | FixtureCardEntry[];
  character?: FixtureCardEntry[];
  stage?: FixtureCardEntry | null;
  trash?: number | FixtureCardEntry[];
  activeDon?: number;
  restedDon?: number;
  donDeckCount?: number;
  playerName?: string;
}

export interface TestMatchOptions {
  seed?: string | number;
  firstPlayer?: MatchSeat;
  activeSeat?: MatchSeat;
  skipSetup?: boolean;
  fillerCardId?: string;
  maxCharacterSlots?: number;
}

interface MaterializedPlayerFixture {
  leaderCardId: string;
  hand: MaterializedFixtureCardState[];
  deck: MaterializedFixtureCardState[];
  life: MaterializedFixtureCardState[];
  character: MaterializedFixtureCardState[];
  stage: MaterializedFixtureCardState | null;
  trash: MaterializedFixtureCardState[];
  activeDon: number;
  restedDon: number;
  donDeckCount?: number;
  playerName?: string;
}

const DEFAULT_LEADER_CARD_ID = "OP13-001";
const DEFAULT_FILLER_CARD_ID = "OP13-013";

export const SOUTH = "south" as const;
export const NORTH = "north" as const;
export const PLAYER_ONE = SOUTH;
export const PLAYER_TWO = NORTH;

function cardRefId(card: CardRef): string {
  return typeof card === "string" ? card : card.id;
}

function fixtureEntryCardId(entry: FixtureCardEntry): string {
  if (typeof entry === "string" || "id" in entry) {
    return cardRefId(entry);
  }
  if ("card" in entry && entry.card) {
    return entry.card.id;
  }
  return entry.cardId;
}

function normalizeEntry(entry: FixtureCardEntry): MaterializedFixtureCardState {
  if (typeof entry === "string" || "id" in entry) {
    return { cardId: cardRefId(entry) };
  }
  if ("card" in entry && entry.card) {
    const { card, ...state } = entry;
    return { ...state, cardId: card.id };
  }
  return entry;
}

function leaderLife(leaderCardId: string): number {
  const leader = getCard(leaderCardId);
  if (leader.cardType !== "leader") {
    throw new Error(
      `Fixture leader must be a leader card, got ${leader.cardType}: ${leaderCardId}`,
    );
  }
  return leader.life;
}

function materializeZone(
  input: number | FixtureCardEntry[] | undefined,
  fallback: MaterializedFixtureCardState[],
  fillerCardId: string,
): MaterializedFixtureCardState[] {
  if (input === undefined) {
    return fallback;
  }
  if (typeof input === "number") {
    return Array.from({ length: input }, () => ({ cardId: fillerCardId }));
  }
  return input.map(normalizeEntry);
}

function materializePlayerFixture(
  fixture: PlayerFixture = {},
  fillerCardId: string,
): MaterializedPlayerFixture {
  const leaderCardId = fixture.leaderCardId
    ? cardRefId(fixture.leaderCardId)
    : DEFAULT_LEADER_CARD_ID;
  const defaultLife = Array.from({ length: leaderLife(leaderCardId) }, () => ({
    cardId: fillerCardId,
  }));

  return {
    leaderCardId,
    hand: materializeZone(fixture.hand, [], fillerCardId),
    deck: materializeZone(
      fixture.deck,
      Array.from({ length: 10 }, () => ({ cardId: fillerCardId })),
      fillerCardId,
    ),
    life: materializeZone(fixture.life, defaultLife, fillerCardId),
    character: (fixture.character ?? []).map(normalizeEntry),
    stage:
      fixture.stage === undefined || fixture.stage === null ? null : normalizeEntry(fixture.stage),
    trash: materializeZone(fixture.trash, [], fillerCardId),
    activeDon: fixture.activeDon ?? 0,
    restedDon: fixture.restedDon ?? 0,
    donDeckCount: fixture.donDeckCount,
    playerName: fixture.playerName,
  };
}

function requiredMainDeckCards(fixture: MaterializedPlayerFixture): string[] {
  return [
    ...fixture.life,
    ...fixture.hand,
    ...fixture.deck,
    ...fixture.character,
    ...(fixture.stage ? [fixture.stage] : []),
    ...fixture.trash,
  ].map((entry) => entry.cardId);
}

function buildConfig(
  playerOne: MaterializedPlayerFixture,
  playerTwo: MaterializedPlayerFixture,
  options: Required<Pick<TestMatchOptions, "firstPlayer" | "seed" | "maxCharacterSlots">>,
): MatchConfig {
  return {
    firstPlayer: options.firstPlayer,
    seed: options.seed,
    shuffleDecks: false,
    openingHandSize: 0,
    skipFirstTurnDraw: true,
    maxCharacterSlots: options.maxCharacterSlots,
    players: {
      south: {
        leaderCardId: playerOne.leaderCardId,
        mainDeck: requiredMainDeckCards(playerOne),
        playerName: playerOne.playerName,
        donDeckCount: playerOne.donDeckCount,
      },
      north: {
        leaderCardId: playerTwo.leaderCardId,
        mainDeck: requiredMainDeckCards(playerTwo),
        playerName: playerTwo.playerName,
        donDeckCount: playerTwo.donDeckCount,
      },
    },
  };
}

function clearPlayerZones(state: MatchState, seat: MatchSeat): string[] {
  const player = state.players[seat];
  const instanceIds = Object.values(state.cards)
    .filter((instance) => instance.owner === seat && instance.zone !== "leader")
    .map((instance) => instance.instanceId);

  player.deck = [];
  player.hand = [];
  player.life = [];
  player.trash = [];
  player.characterArea = player.characterArea.map(() => null);
  player.stageArea = null;

  return instanceIds;
}

function takeInstance(
  state: MatchState,
  pool: string[],
  seat: MatchSeat,
  cardId: string,
  zone: CardZone,
): string {
  const poolIndex = pool.findIndex((instanceId) => state.cards[instanceId]?.cardId === cardId);
  if (poolIndex < 0) {
    throw new Error(`Fixture for ${seat} does not have an instance of ${cardId} for ${zone}.`);
  }
  const [instanceId] = pool.splice(poolIndex, 1);
  return instanceId!;
}

function applyCardState(
  state: MatchState,
  instanceId: string,
  seat: MatchSeat,
  zone: CardZone,
  zoneIndex: number,
  entry: MaterializedFixtureCardState,
) {
  const instance = state.cards[instanceId]!;
  instance.owner = seat;
  instance.controller = seat;
  instance.zone = zone;
  instance.zoneIndex = zoneIndex;
  instance.rested = entry.rested ?? false;
  instance.attachedDon = entry.attachedDon ?? 0;
  instance.playedOnTurn = entry.playedOnTurn ?? null;
  instance.faceUp = entry.faceUp ?? (zone !== "deck" && zone !== "life" && zone !== "hand");
  instance.publicKnowledge =
    entry.publicKnowledge ?? (zone === "trash" || zone === "character" || zone === "stage");
}

function placeLinearZone(
  state: MatchState,
  pool: string[],
  seat: MatchSeat,
  zone: "deck" | "hand" | "life" | "trash",
  entries: MaterializedFixtureCardState[],
) {
  const player = state.players[seat];
  player[zone] = entries.map((entry, index) => {
    const instanceId = takeInstance(state, pool, seat, entry.cardId, zone);
    applyCardState(state, instanceId, seat, zone, index, entry);
    return instanceId;
  });
}

function placeCharacters(
  state: MatchState,
  pool: string[],
  seat: MatchSeat,
  entries: MaterializedFixtureCardState[],
) {
  const player = state.players[seat];
  for (const [index, entry] of entries.entries()) {
    if (index >= player.characterArea.length) {
      throw new Error(`Fixture for ${seat} has more characters than available slots.`);
    }
    const instanceId = takeInstance(state, pool, seat, entry.cardId, "character");
    applyCardState(state, instanceId, seat, "character", index, {
      ...entry,
      faceUp: entry.faceUp ?? true,
      publicKnowledge: entry.publicKnowledge ?? true,
    });
    player.characterArea[index] = instanceId;
  }
}

function placeStage(
  state: MatchState,
  pool: string[],
  seat: MatchSeat,
  entry: MaterializedFixtureCardState | null,
) {
  if (!entry) {
    return;
  }
  const instanceId = takeInstance(state, pool, seat, entry.cardId, "stage");
  applyCardState(state, instanceId, seat, "stage", 0, {
    ...entry,
    faceUp: entry.faceUp ?? true,
    publicKnowledge: entry.publicKnowledge ?? true,
  });
  state.players[seat].stageArea = instanceId;
}

function applyPlayerFixture(
  state: MatchState,
  seat: MatchSeat,
  fixture: MaterializedPlayerFixture,
) {
  const pool = clearPlayerZones(state, seat);

  placeLinearZone(state, pool, seat, "life", fixture.life);
  placeLinearZone(state, pool, seat, "hand", fixture.hand);
  placeLinearZone(state, pool, seat, "deck", fixture.deck);
  placeLinearZone(state, pool, seat, "trash", fixture.trash);
  placeCharacters(state, pool, seat, fixture.character);
  placeStage(state, pool, seat, fixture.stage);

  const player = state.players[seat];
  player.activeDon = fixture.activeDon;
  player.restedDon = fixture.restedDon;
  if (fixture.donDeckCount !== undefined) {
    player.donDeckCount = fixture.donDeckCount;
  }
}

export function createTestMatchState(
  playerOneFixture: PlayerFixture = {},
  playerTwoFixture: PlayerFixture = {},
  options: TestMatchOptions = {},
): MatchState {
  const fillerCardId = options.fillerCardId ?? DEFAULT_FILLER_CARD_ID;
  const playerOne = materializePlayerFixture(playerOneFixture, fillerCardId);
  const playerTwo = materializePlayerFixture(playerTwoFixture, fillerCardId);
  const config = buildConfig(playerOne, playerTwo, {
    firstPlayer: options.firstPlayer ?? PLAYER_ONE,
    seed: options.seed ?? "one-piece-test-seed",
    maxCharacterSlots: options.maxCharacterSlots ?? 5,
  });
  const state = createMatch(config);

  applyPlayerFixture(state, PLAYER_ONE, playerOne);
  applyPlayerFixture(state, PLAYER_TWO, playerTwo);

  if (options.skipSetup ?? true) {
    state.status = "active";
    state.setup.started = true;
    state.activeSeat = options.activeSeat ?? options.firstPlayer ?? PLAYER_ONE;
    state.phase = "main";
  }

  return state;
}

export function extractCardId(entry: FixtureCardEntry): string {
  return fixtureEntryCardId(entry);
}
