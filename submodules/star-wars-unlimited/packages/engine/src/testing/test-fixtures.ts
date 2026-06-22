import { getCard } from "@tcg/star-wars-unlimited-cards";
import type { SwuCardDefinition, SwuZone } from "@tcg/star-wars-unlimited-types";
import { addCardToState, createInitialState, registerDefinition } from "../state.ts";
import type { CreateMatchOptions } from "../state.ts";
import type { MatchState, PlayerId, RuntimeCard } from "../types.ts";

export const P1: PlayerId = "player-one";
export const P2: PlayerId = "player-two";

export const DEFAULT_BASE_ID = "8327910265";
export const DEFAULT_LEADER_ID = "4626028465";
export const DEFAULT_UNIT_ID = "7109944284";

export type FixtureCardEntry = string | SwuCardDefinition | FixtureCardState;
export type FixtureCardOverrides = Omit<FixtureCardState, "alias" | "card" | "instanceId">;

export interface FixtureCardState {
  readonly card: string | SwuCardDefinition;
  readonly alias?: string;
  readonly instanceId?: string;
  readonly exhausted?: boolean;
  readonly playedThisPhase?: boolean;
  readonly damage?: number;
  readonly experience?: number;
  readonly shield?: number;
  readonly temporaryPower?: number;
  readonly temporaryHp?: number;
  readonly keywords?: readonly string[];
  readonly traits?: readonly string[];
  readonly upgrades?: readonly FixtureCardEntry[];
  readonly capturedCards?: readonly FixtureCardEntry[];
}

export interface PlayerFixture {
  readonly base?: FixtureCardEntry;
  readonly leader?: FixtureCardEntry;
  readonly hand?: number | readonly FixtureCardEntry[];
  readonly deck?: number | readonly FixtureCardEntry[];
  readonly discard?: number | readonly FixtureCardEntry[];
  readonly resource?: number | readonly FixtureCardEntry[];
  readonly groundArena?: readonly FixtureCardEntry[];
  readonly spaceArena?: readonly FixtureCardEntry[];
  readonly force?: number;
  readonly credits?: number;
  readonly advantage?: number;
  readonly readyResources?: number;
  readonly hasInitiative?: boolean;
  readonly passed?: boolean;
}

export interface SwuTestFixture {
  readonly id?: string;
  readonly activePlayer?: PlayerId;
  readonly phase?: MatchState["phase"];
  readonly phaseHistory?: Partial<MatchState["phaseHistory"]>;
  readonly definitions?: readonly SwuCardDefinition[];
  readonly playerOne?: PlayerFixture;
  readonly playerTwo?: PlayerFixture;
}

function isFixtureCardState(entry: FixtureCardEntry): entry is FixtureCardState {
  return typeof entry === "object" && "card" in entry;
}

export function extractDefinitionId(
  entry: FixtureCardEntry | undefined,
  fallbackId: string,
): string {
  if (!entry) return fallbackId;
  if (typeof entry === "string") return entry;
  if (isFixtureCardState(entry)) {
    return typeof entry.card === "string" ? entry.card : entry.card.id;
  }
  return entry.id;
}

function definitionFromEntry(state: MatchState, entry: FixtureCardEntry): SwuCardDefinition {
  const candidate = isFixtureCardState(entry) ? entry.card : entry;
  if (typeof candidate === "string") return state.definitions[candidate] ?? getCard(candidate);
  return registerDefinition(state, candidate);
}

function numberedEntries(count: number): FixtureCardEntry[] {
  return Array.from({ length: count }, () => DEFAULT_UNIT_ID);
}

function normalizeEntries(
  entries: number | readonly FixtureCardEntry[] | undefined,
): readonly FixtureCardEntry[] {
  if (entries === undefined) return [];
  return typeof entries === "number" ? numberedEntries(entries) : entries;
}

function addFixtureCard(
  state: MatchState,
  owner: PlayerId,
  zone: SwuZone,
  entry: FixtureCardEntry,
): RuntimeCard {
  const definition = definitionFromEntry(state, entry);
  const fixtureState: FixtureCardState | undefined = isFixtureCardState(entry) ? entry : undefined;
  const card = addCardToState(state, definition, owner, zone, {
    controller: owner,
    exhausted: fixtureState?.exhausted ?? false,
    playedThisPhase: fixtureState?.playedThisPhase ?? false,
    damage: fixtureState?.damage ?? 0,
    experience: fixtureState?.experience ?? 0,
    shield: fixtureState?.shield ?? 0,
    temporaryPower: fixtureState?.temporaryPower ?? 0,
    temporaryHp: fixtureState?.temporaryHp ?? 0,
    keywords: [...(fixtureState?.keywords ?? definition.keywords ?? [])],
    traits: [...(fixtureState?.traits ?? definition.traits ?? [])],
  });
  const explicitInstanceId = fixtureState?.instanceId ?? fixtureState?.alias;
  if (explicitInstanceId) {
    delete state.cards[card.instanceId];
    state.cards[explicitInstanceId] = { ...card, instanceId: explicitInstanceId };
    return state.cards[explicitInstanceId];
  }
  return card;
}

export function fixtureCard(
  alias: string,
  card: string | SwuCardDefinition,
  state: FixtureCardOverrides = {},
): FixtureCardState {
  return { ...state, alias, card };
}

export function exhaustedCard(
  alias: string,
  card: string | SwuCardDefinition,
  state: FixtureCardOverrides = {},
): FixtureCardState {
  return fixtureCard(alias, card, { ...state, exhausted: true });
}

export function damagedCard(
  alias: string,
  card: string | SwuCardDefinition,
  damage = 1,
  state: FixtureCardOverrides = {},
): FixtureCardState {
  return fixtureCard(alias, card, { ...state, damage });
}

export function shieldedCard(
  alias: string,
  card: string | SwuCardDefinition,
  shield = 1,
  state: FixtureCardOverrides = {},
): FixtureCardState {
  return fixtureCard(alias, card, { ...state, shield });
}

export function experiencedCard(
  alias: string,
  card: string | SwuCardDefinition,
  experience = 1,
  state: FixtureCardOverrides = {},
): FixtureCardState {
  return fixtureCard(alias, card, { ...state, experience });
}

export const swuFixture = {
  card: fixtureCard,
  damaged: damagedCard,
  exhausted: exhaustedCard,
  experienced: experiencedCard,
  shielded: shieldedCard,
};

function applyZoneFixture(
  state: MatchState,
  playerId: PlayerId,
  fixture: PlayerFixture,
  zone: SwuZone,
): void {
  const entries = normalizeEntries(
    fixture[zone as keyof PlayerFixture] as number | readonly FixtureCardEntry[] | undefined,
  );
  for (const entry of entries) {
    addFixtureCard(state, playerId, zone, entry);
  }
}

function applyPlayerFixture(
  state: MatchState,
  playerId: PlayerId,
  fixture: PlayerFixture = {},
): void {
  const player = state.players[playerId];
  player.force = fixture.force ?? 0;
  player.credits = fixture.credits ?? 0;
  player.advantage = fixture.advantage ?? 0;
  player.hasInitiative = fixture.hasInitiative ?? player.hasInitiative;
  player.passed = fixture.passed ?? false;

  for (const zone of [
    "hand",
    "deck",
    "discard",
    "resource",
    "groundArena",
    "spaceArena",
  ] as const) {
    applyZoneFixture(state, playerId, fixture, zone);
  }

  const resourceCount =
    typeof fixture.resource === "number"
      ? fixture.resource
      : normalizeEntries(fixture.resource).length;
  player.resources = resourceCount;
  player.readyResources = fixture.readyResources ?? resourceCount;
}

export function createFixtureState(fixture: SwuTestFixture = {}): MatchState {
  const playerOne = fixture.playerOne ?? {};
  const playerTwo = fixture.playerTwo ?? {};
  const firstPlayer = fixture.activePlayer ?? P1;
  const players: CreateMatchOptions["players"] = {
    "player-one": {
      name: "Player One",
      deck: {
        baseId: extractDefinitionId(playerOne.base, DEFAULT_BASE_ID),
        leaderId: extractDefinitionId(playerOne.leader, DEFAULT_LEADER_ID),
        deckIds: [],
      },
    },
    "player-two": {
      name: "Player Two",
      deck: {
        baseId: extractDefinitionId(playerTwo.base, DEFAULT_BASE_ID),
        leaderId: extractDefinitionId(playerTwo.leader, DEFAULT_LEADER_ID),
        deckIds: [],
      },
    },
  };
  const state = createInitialState({
    id: fixture.id ?? "swu-test-match",
    firstPlayer,
    players,
  });

  for (const definition of fixture.definitions ?? []) {
    registerDefinition(state, definition);
  }

  state.phase = fixture.phase ?? "action";
  state.phaseHistory = {
    ...state.phaseHistory,
    ...fixture.phaseHistory,
    unitsDefeatedByController: {
      ...state.phaseHistory.unitsDefeatedByController,
      ...fixture.phaseHistory?.unitsDefeatedByController,
    },
  };
  state.activePlayer = firstPlayer;
  applyPlayerFixture(state, P1, playerOne);
  applyPlayerFixture(state, P2, playerTwo);
  return state;
}
