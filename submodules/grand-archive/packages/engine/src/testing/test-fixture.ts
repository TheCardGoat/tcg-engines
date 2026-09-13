import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveZone,
} from "@tcg/grand-archive-types";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../game/identity.ts";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "../game/model.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import {
  createGrandArchiveMatchProgram,
  type GrandArchiveMatchProgram,
} from "../kernel/match-program.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveDeckEntry,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";

export type GrandArchiveTestCardDefinition = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;

export const GRAND_ARCHIVE_TEST_FIXTURE_ZONES = [
  "main-deck",
  "material-deck",
  "hand",
  "memory",
  "graveyard",
  "banishment",
  "field",
] as const satisfies readonly GrandArchiveZone[];

export type GrandArchiveTestFixtureZone = (typeof GRAND_ARCHIVE_TEST_FIXTURE_ZONES)[number];

export interface GrandArchiveTestPlayerFixture {
  readonly id?: string;
  readonly name?: string;
  readonly champion: GrandArchiveTestCardDefinition;
  /** Additional champion faces, ordered from the first level above the starter to the active face. */
  readonly lineage?: readonly GrandArchiveTestCardDefinition[];
  /** Defaults to true so ordinary card tests are not constrained by the first-turn attack rule. */
  readonly hasTakenFirstTurn?: boolean;
  readonly zones?: Readonly<
    Partial<Record<GrandArchiveTestFixtureZone, readonly GrandArchiveTestCardDefinition[]>>
  >;
}

export interface GrandArchiveTestFixture {
  readonly playerOne: GrandArchiveTestPlayerFixture;
  readonly playerTwo: GrandArchiveTestPlayerFixture;
  readonly firstPlayer?: "playerOne" | "playerTwo";
  /** Only phases whose production invariants can be constructed without an active procedure. */
  readonly phase?: "main" | "materialize";
  readonly randomSeed?: number;
  /**
   * Runs the production Standard pre-game workflow before arranging requested
   * non-deck zones. Use this for starting-champion On Enter tests.
   */
  readonly pregame?: "skip" | "resolve";
  /** Extra generated objects that effects may create but which do not begin in a player's deck. */
  readonly definitions?: readonly GrandArchiveTestCardDefinition[];
}

export interface GrandArchiveBuiltTestFixture {
  readonly program: GrandArchiveMatchProgram;
  readonly state: GrandArchiveMatchState;
}

function faceOf(card: GrandArchiveTestCardDefinition) {
  return card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
}

function startsInMaterialDeck(card: GrandArchiveTestCardDefinition): boolean {
  const face = faceOf(card);
  return face.typeLine.types.includes("CHAMPION") || face.typeLine.supertypes.includes("REGALIA");
}

function countDefinitions(
  cards: readonly GrandArchiveTestCardDefinition[],
): GrandArchiveDeckEntry[] {
  const counts = new Map<string, number>();
  for (const card of cards) counts.set(card.canonicalId, (counts.get(card.canonicalId) ?? 0) + 1);
  return [...counts.entries()].map(([definitionId, count]) => ({ definitionId, count }));
}

function fixtureCards(
  player: GrandArchiveTestPlayerFixture,
): readonly GrandArchiveTestCardDefinition[] {
  return [
    ...(player.lineage ?? []),
    ...GRAND_ARCHIVE_TEST_FIXTURE_ZONES.flatMap((zone) => player.zones?.[zone] ?? []),
  ];
}

function arrangeChampionLineage(
  state: GrandArchiveMatchState,
  player: GrandArchiveTestPlayerFixture,
  defaultId: string,
): GrandArchiveMatchState {
  const playerId = grandArchivePlayerId(player.id ?? defaultId);
  let arranged = state;
  for (const level of player.lineage ?? []) {
    const championId = arranged.zones[playerId].field.find(
      (objectId) => arranged.objects[objectId]?.definitionId === player.champion.canonicalId,
    );
    const cardId = arranged.zones[playerId]["material-deck"].find(
      (objectId) => arranged.objects[objectId]?.definitionId === level.canonicalId,
    );
    if (!championId || !cardId) {
      throw new Error(`Could not arrange ${level.canonicalId} in ${playerId}'s champion lineage.`);
    }
    arranged = new GrandArchiveTransactionKernel().transact(arranged, [
      { type: "champion-leveled-up", championId, cardId },
    ]).state;
  }
  return arranged;
}

function startingDecks(player: GrandArchiveTestPlayerFixture): {
  readonly mainDeck: readonly GrandArchiveDeckEntry[];
  readonly materialDeck: readonly GrandArchiveDeckEntry[];
} {
  const cards = fixtureCards(player);
  return {
    mainDeck: countDefinitions(cards.filter((card) => !startsInMaterialDeck(card))),
    materialDeck: countDefinitions([
      player.champion,
      ...cards.filter((card) => startsInMaterialDeck(card)),
    ]),
  };
}

function uniqueDefinitions(fixture: GrandArchiveTestFixture): GrandArchiveTestCardDefinition[] {
  const definitions = [
    fixture.playerOne.champion,
    fixture.playerTwo.champion,
    ...fixtureCards(fixture.playerOne),
    ...fixtureCards(fixture.playerTwo),
    ...(fixture.definitions ?? []),
  ];
  return [...new Map(definitions.map((card) => [card.canonicalId, card] as const)).values()];
}

function arrangePlayerZones(
  state: GrandArchiveMatchState,
  player: GrandArchiveTestPlayerFixture,
  defaultId: string,
): GrandArchiveMatchState {
  const playerId = grandArchivePlayerId(player.id ?? defaultId);
  const claimedObjectIds = new Set<GrandArchiveObjectId>();
  const fixtureZones: ReadonlySet<GrandArchiveZone> = new Set(GRAND_ARCHIVE_TEST_FIXTURE_ZONES);
  let arranged = state;
  for (const zone of GRAND_ARCHIVE_TEST_FIXTURE_ZONES) {
    if (zone === "main-deck" || zone === "material-deck") continue;
    for (const card of player.zones?.[zone] ?? []) {
      const preferredOrigin = startsInMaterialDeck(card) ? "material-deck" : "main-deck";
      const availableObjects = Object.values(arranged.objects).filter(
        (object) =>
          object.ownerId === playerId &&
          object.definitionId === card.canonicalId &&
          !claimedObjectIds.has(object.id) &&
          fixtureZones.has(object.zone),
      );
      const currentObject: GrandArchiveCardInstance | undefined =
        availableObjects.find((object) => object.zone === zone) ??
        availableObjects.find((object) => object.zone === preferredOrigin) ??
        availableObjects[0];
      if (!currentObject) {
        throw new Error(`Could not arrange ${card.canonicalId} for ${playerId} in ${zone}.`);
      }
      claimedObjectIds.add(currentObject.id);
      if (currentObject.zone === zone) continue;
      const objectId = currentObject.id;
      arranged = new GrandArchiveTransactionKernel().transact(arranged, [
        { type: "object-moved", objectId, from: currentObject.zone, to: zone },
      ]).state;
      const durability = faceOf(card).stats.durability;
      if (zone === "field" && durability !== undefined && durability > 0) {
        arranged = new GrandArchiveTransactionKernel().transact(arranged, [
          { type: "counter-changed", objectId, counter: "durability", delta: durability },
        ]).state;
      }
    }
  }
  return arranged;
}

/** Build a compact, deterministic two-player fixture over production match state. */
export function buildGrandArchiveTestFixture(
  fixture: GrandArchiveTestFixture,
): GrandArchiveBuiltTestFixture {
  const playerOne = {
    ...fixture.playerOne,
    id: fixture.playerOne.id ?? "player-one",
    name: fixture.playerOne.name ?? "Player One",
  };
  const playerTwo = {
    ...fixture.playerTwo,
    id: fixture.playerTwo.id ?? "player-two",
    name: fixture.playerTwo.name ?? "Player Two",
  };
  if (playerOne.id === playerTwo.id)
    throw new Error("Grand Archive fixture players must be distinct.");

  const program = createGrandArchiveMatchProgram(uniqueDefinitions(fixture));
  const oneDecks = startingDecks(playerOne);
  const twoDecks = startingDecks(playerTwo);
  const firstPlayerId = fixture.firstPlayer === "playerTwo" ? playerTwo.id : playerOne.id;
  let state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [
        {
          id: playerOne.id,
          name: playerOne.name,
          ...oneDecks,
          startingChampionDefinitionId: playerOne.champion.canonicalId,
        },
        {
          id: playerTwo.id,
          name: playerTwo.name,
          ...twoDecks,
          startingChampionDefinitionId: playerTwo.champion.canonicalId,
        },
      ],
      firstPlayerId,
      randomSeed: fixture.randomSeed ?? 1,
    },
    {
      validateDeckConstruction: false,
      skipPregameForTests: fixture.pregame !== "resolve",
    },
  );
  if (fixture.pregame === "resolve") {
    const runtime = new GrandArchiveMatchRuntime(program, state);
    for (const playerId of state.turnOrder) {
      const transition = runtime.execute(
        { move: "complete-pregame-actions" },
        { playerId, expectedStateVersion: runtime.state.stateVersion },
      );
      if (!transition.ok) {
        throw new Error(
          `Could not resolve Grand Archive pre-game actions for ${playerId}: ${transition.message}`,
        );
      }
    }
    state = runtime.state;
  }
  state = arrangePlayerZones(state, playerOne, "player-one");
  state = arrangePlayerZones(state, playerTwo, "player-two");
  state = arrangeChampionLineage(state, playerOne, "player-one");
  state = arrangeChampionLineage(state, playerTwo, "player-two");
  state = {
    ...state,
    players: Object.fromEntries(
      Object.entries(state.players).map(([playerId, player]) => [
        playerId,
        {
          ...player,
          hasTakenFirstTurn:
            playerId === playerOne.id
              ? (playerOne.hasTakenFirstTurn ?? true)
              : (playerTwo.hasTakenFirstTurn ?? true),
        },
      ]),
    ),
  };
  if (fixture.phase && fixture.phase !== state.turn.phase) {
    const isMaterialize = fixture.phase === "materialize";
    state = {
      ...state,
      turn: {
        ...state.turn,
        phase: fixture.phase,
        materializeKind: isMaterialize ? "regular" : null,
        materializeChoicePending: isMaterialize,
      },
      opportunity: isMaterialize
        ? null
        : state.opportunity
          ? { ...state.opportunity, reason: "phase-begin", passedPlayerIds: [] }
          : state.opportunity,
    };
  }
  return { program, state };
}
