import type { GrandArchiveZone } from "@tcg/grand-archive-types";
import { flattenGrandArchiveAbilities } from "../../game/card-runtime.ts";
import { grandArchiveObjectId, grandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { requireGrandArchiveCard } from "../../kernel/match-program.ts";
import type {
  GrandArchiveCardInstance,
  GrandArchiveGameMode,
  GrandArchiveMatchState,
  GrandArchivePlayerState,
} from "../../game/model.ts";
import { shuffleGrandArchiveObjects } from "../../game/random.ts";
import { createEmptyGrandArchiveZones, GRAND_ARCHIVE_PRIVATE_ZONES } from "../../game/zones.ts";

export interface GrandArchiveDeckEntry {
  readonly definitionId: string;
  readonly count: number;
}

interface GrandArchivePlayerSetupBase {
  readonly id: string;
  readonly name: string;
  readonly mainDeck: readonly GrandArchiveDeckEntry[];
  readonly materialDeck: readonly GrandArchiveDeckEntry[];
  readonly startingChampionDefinitionId: string;
}

export interface GrandArchiveStandardPlayerSetup extends GrandArchivePlayerSetupBase {
  readonly sideboard?: readonly GrandArchiveDeckEntry[];
  readonly pantheon?: never;
}

export interface GrandArchiveDraftPlayerSetup extends GrandArchivePlayerSetupBase {
  /** Every drafted card not selected for a starting deck remains available here. */
  readonly sideboard: readonly GrandArchiveDeckEntry[];
  readonly pantheon?: never;
}

export interface GrandArchivePantheonPlayerSetup extends GrandArchivePlayerSetupBase {
  readonly sideboard?: never;
  readonly pantheon: {
    readonly lesserBoonDefinitionId: string;
    readonly greaterBoonDefinitionId: string;
    readonly barrierDefinitionId: string;
  };
}

export type GrandArchivePantheonPlayers =
  | readonly [
      GrandArchivePantheonPlayerSetup,
      GrandArchivePantheonPlayerSetup,
      GrandArchivePantheonPlayerSetup,
    ]
  | readonly [
      GrandArchivePantheonPlayerSetup,
      GrandArchivePantheonPlayerSetup,
      GrandArchivePantheonPlayerSetup,
      GrandArchivePantheonPlayerSetup,
    ];

export type InitializeGrandArchiveMatchInput =
  | {
      readonly mode: "standard";
      readonly players: readonly [GrandArchiveStandardPlayerSetup, GrandArchiveStandardPlayerSetup];
      readonly firstPlayerId: string;
      readonly randomSeed: number;
    }
  | {
      readonly mode: "draft";
      readonly players: readonly [GrandArchiveDraftPlayerSetup, GrandArchiveDraftPlayerSetup];
      /** The selected draft format may impose its own by-name Main Deck copy limit. */
      readonly mainDeckCopyLimit?: number;
      readonly firstPlayerId: string;
      readonly randomSeed: number;
    }
  | {
      readonly mode: "pantheon";
      readonly players: GrandArchivePantheonPlayers;
      readonly firstPlayerId: string;
      readonly randomSeed: number;
    };

export interface GrandArchiveInitializeOptions {
  /** Test fixtures may opt out; simulator and production initialization enforce decks by default. */
  readonly validateDeckConstruction?: boolean;
  /** Legacy fixture shortcut; production callers must execute the serializable pre-game workflow. */
  readonly skipPregameForTests?: boolean;
}

function faceOf(card: ReturnType<typeof requireGrandArchiveCard>) {
  return card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
}

function assertCardType(
  program: GrandArchiveMatchProgram,
  definitionId: string,
  requiredType: "CHAMPION" | "LESSER BOON" | "GREATER BOON",
) {
  const face = faceOf(requireGrandArchiveCard(program, definitionId));
  if (!face.typeLine.types.includes(requiredType)) {
    throw new Error(`${definitionId} must be a ${requiredType} card`);
  }
  return face;
}

function assertPantheonBarrierDefinition(
  program: GrandArchiveMatchProgram,
  definitionId: string,
): void {
  const definition = requireGrandArchiveCard(program, definitionId);
  const face = faceOf(definition);
  if (
    definition.definitionKind !== "token-representation" ||
    face.name !== "Pantheon Barrier" ||
    !face.typeLine.subtypes.includes("BARRIER")
  ) {
    throw new Error(`${definitionId} must be the Pantheon Barrier token definition`);
  }
}

function expandDeck(entries: readonly GrandArchiveDeckEntry[]): string[] {
  const cards: string[] = [];
  for (const entry of entries) {
    if (!Number.isInteger(entry.count) || entry.count < 0) {
      throw new Error(`Invalid deck count for ${entry.definitionId}`);
    }
    for (let index = 0; index < entry.count; index += 1) cards.push(entry.definitionId);
  }
  return cards;
}

function cardHasKeyword(
  program: GrandArchiveMatchProgram,
  definitionId: string,
  keywordName: import("@tcg/grand-archive-types").GrandArchiveKeywordName,
): boolean {
  const face = faceOf(requireGrandArchiveCard(program, definitionId));
  return flattenGrandArchiveAbilities(face.abilities).some((ability) => {
    if (ability.kind === "keyword-group") {
      return ability.keywords.some((keyword) => keyword.name === keywordName);
    }
    return (
      ability.kind === "static" &&
      ability.staticKind === "intrinsic" &&
      ability.keyword.name === keywordName
    );
  });
}

function assertNameCopyLimit(
  program: GrandArchiveMatchProgram,
  definitions: readonly string[],
  maximum: number,
  deckName: "main" | "material",
): void {
  const counts = new Map<string, number>();
  for (const definitionId of definitions) {
    const name = faceOf(requireGrandArchiveCard(program, definitionId)).name;
    const count = (counts.get(name) ?? 0) + 1;
    if (count > maximum) {
      throw new Error(`${deckName} deck contains more than ${maximum} card(s) named ${name}`);
    }
    counts.set(name, count);
  }
}

function assertPhysicalDeckCards(
  program: GrandArchiveMatchProgram,
  definitions: readonly string[],
): void {
  for (const definitionId of definitions) {
    const definition = requireGrandArchiveCard(program, definitionId);
    if (definition.definitionKind !== "card") {
      throw new Error(
        `${faceOf(definition).name} is not a physical card and cannot start in a deck`,
      );
    }
  }
}

function assertPrintedFormatRestrictions(
  program: GrandArchiveMatchProgram,
  mode: GrandArchiveGameMode,
  definitions: readonly string[],
): void {
  if (mode === "pantheon") return;
  for (const definitionId of definitions) {
    const definition = requireGrandArchiveCard(program, definitionId);
    if (definition.formatRestriction?.kind === "pantheon-only") {
      throw new Error(
        `${faceOf(definition).name} has a Pantheon tag and cannot be included in ${mode === "draft" ? "Draft" : "Standard"}`,
      );
    }
  }
}

type GrandArchiveStartingDeckLocation = "main-deck" | "material-deck" | "pantheon";

function startingDeckLocation(
  program: GrandArchiveMatchProgram,
  definitionId: string,
): GrandArchiveStartingDeckLocation {
  const face = faceOf(requireGrandArchiveCard(program, definitionId));
  if (face.typeLine.types.includes("LESSER BOON") || face.typeLine.types.includes("GREATER BOON")) {
    return "pantheon";
  }
  if (face.typeLine.types.includes("CHAMPION") || face.typeLine.supertypes.includes("REGALIA")) {
    return "material-deck";
  }
  return "main-deck";
}

function startingDeckDefinitionIds(
  setup:
    | GrandArchiveStandardPlayerSetup
    | GrandArchiveDraftPlayerSetup
    | GrandArchivePantheonPlayerSetup,
): readonly string[] {
  const definitions = [...expandDeck(setup.mainDeck), ...expandDeck(setup.materialDeck)];
  if (setup.pantheon) {
    definitions.push(setup.pantheon.lesserBoonDefinitionId, setup.pantheon.greaterBoonDefinitionId);
  }
  return definitions;
}

function startingDeckMaximumAdjustment(
  program: GrandArchiveMatchProgram,
  setup:
    | GrandArchiveStandardPlayerSetup
    | GrandArchiveDraftPlayerSetup
    | GrandArchivePantheonPlayerSetup,
  zone: "main-deck" | "material-deck",
): number {
  let adjustment = 0;
  for (const definitionId of new Set(startingDeckDefinitionIds(setup))) {
    const face = faceOf(requireGrandArchiveCard(program, definitionId));
    for (const ability of flattenGrandArchiveAbilities(face.abilities)) {
      if (
        ability.kind === "game-setup" &&
        ability.rule.kind === "modify-starting-deck-limit" &&
        ability.rule.zone === zone &&
        ability.rule.operation === "add-to-maximum" &&
        ability.rule.appliesIfIncluded
      ) {
        adjustment += ability.rule.amount;
      }
    }
  }
  return adjustment;
}

function assertSideboardIsLegal(
  program: GrandArchiveMatchProgram,
  mode: GrandArchiveGameMode,
  definitions: readonly string[],
): void {
  if (mode === "pantheon") {
    if (definitions.length > 0) throw new Error("Pantheon matches do not use a sideboard");
    return;
  }
  for (const definitionId of definitions) {
    if (startingDeckLocation(program, definitionId) === "pantheon") {
      throw new Error(
        `${faceOf(requireGrandArchiveCard(program, definitionId)).name} cannot be sideboarded`,
      );
    }
  }
  if (mode !== "standard") return;
  if (definitions.length > 15) throw new Error("Standard sideboard cannot exceed 15 cards");
  const points = definitions.reduce(
    (total, definitionId) =>
      total + (startingDeckLocation(program, definitionId) === "material-deck" ? 3 : 1),
    0,
  );
  if (points > 15) throw new Error("Standard sideboard cannot exceed 15 points");
}

function assertRegaliaNameCopyLimit(
  program: GrandArchiveMatchProgram,
  definitions: readonly string[],
): void {
  const regalia = definitions.filter(
    (definitionId) =>
      startingDeckLocation(program, definitionId) === "material-deck" &&
      faceOf(requireGrandArchiveCard(program, definitionId)).typeLine.supertypes.includes(
        "REGALIA",
      ),
  );
  assertNameCopyLimit(program, regalia, 1, "material");
}

export function assertGrandArchiveDeckConstruction(
  program: GrandArchiveMatchProgram,
  mode: GrandArchiveGameMode,
  setup:
    | GrandArchiveStandardPlayerSetup
    | GrandArchiveDraftPlayerSetup
    | GrandArchivePantheonPlayerSetup,
  options: { readonly draftMainDeckCopyLimit?: number } = {},
): void {
  const main = expandDeck(setup.mainDeck);
  const material = expandDeck(setup.materialDeck);
  const sideboard = expandDeck(setup.sideboard ?? []);
  const mainMinimum = mode === "draft" ? 30 : 60;
  if (main.length < mainMinimum) {
    throw new Error(
      `${mode === "draft" ? "Draft" : "Main"} deck must contain at least ${mainMinimum} cards`,
    );
  }
  assertPhysicalDeckCards(program, main);
  assertPhysicalDeckCards(program, material);
  assertPhysicalDeckCards(program, sideboard);
  assertPrintedFormatRestrictions(program, mode, [...main, ...material, ...sideboard]);
  assertSideboardIsLegal(program, mode, sideboard);
  const materialMaximum =
    (mode === "draft" ? 10 : 12) + startingDeckMaximumAdjustment(program, setup, "material-deck");
  if (mode === "standard") {
    if (material.length > materialMaximum) {
      throw new Error(`Standard material deck cannot exceed ${materialMaximum} cards`);
    }
    assertNameCopyLimit(program, main, 4, "main");
    assertNameCopyLimit(program, material, 1, "material");
  } else if (mode === "pantheon") {
    if (material.length < 12 || material.length > materialMaximum) {
      throw new Error(
        `Pantheon material deck must contain between 12 and ${materialMaximum} cards`,
      );
    }
    assertNameCopyLimit(program, main, 1, "main");
    assertRegaliaNameCopyLimit(program, material);
  } else if (material.length > materialMaximum) {
    throw new Error(`Draft material deck cannot exceed ${materialMaximum} cards`);
  } else {
    assertRegaliaNameCopyLimit(program, material);
    const copyLimit = options.draftMainDeckCopyLimit;
    if (copyLimit !== undefined) {
      if (!Number.isSafeInteger(copyLimit) || copyLimit < 1) {
        throw new Error("Draft Main Deck copy limit must be a positive integer");
      }
      assertNameCopyLimit(program, main, copyLimit, "main");
    }
  }
  for (const definitionId of main) {
    const location = startingDeckLocation(program, definitionId);
    if (location !== "main-deck") {
      const face = faceOf(requireGrandArchiveCard(program, definitionId));
      throw new Error(
        location === "material-deck"
          ? `${face.name} must start in the material deck`
          : `${face.name} must start in the Pantheon`,
      );
    }
  }
  for (const definitionId of material) {
    if (startingDeckLocation(program, definitionId) !== "material-deck") {
      throw new Error(
        `${faceOf(requireGrandArchiveCard(program, definitionId)).name} cannot start in the material deck`,
      );
    }
  }
  if (
    !material.some((definitionId) => {
      const face = faceOf(requireGrandArchiveCard(program, definitionId));
      return face.typeLine.types.includes("CHAMPION") && face.stats.level === 0;
    })
  ) {
    throw new Error("Material deck must contain a level 0 champion");
  }
  const divineRelicCount = material.filter((definitionId) =>
    cardHasKeyword(program, definitionId, "divine-relic"),
  ).length;
  if (divineRelicCount > 1) {
    throw new Error("Material deck cannot contain more than one Divine Relic card");
  }
}

function rotateFirst<Value>(values: readonly Value[], firstIndex: number): readonly Value[] {
  return [...values.slice(firstIndex), ...values.slice(0, firstIndex)];
}

/**
 * Enforces the player counts defined by the Standard and Pantheon formats at
 * the runtime boundary as well as in `InitializeGrandArchiveMatchInput`.
 */
export function assertGrandArchiveMatchPlayerCount(
  mode: GrandArchiveGameMode,
  playerCount: number,
): void {
  if ((mode === "standard" || mode === "draft") && playerCount !== 2) {
    throw new Error(
      `${mode === "standard" ? "Standard" : "Draft"} matches require exactly 2 players`,
    );
  }
  if (mode === "pantheon" && playerCount !== 3 && playerCount !== 4) {
    throw new Error("Pantheon matches require exactly 3 or 4 players");
  }
}

export function createGrandArchiveMatchInitialState(
  program: GrandArchiveMatchProgram,
  input: InitializeGrandArchiveMatchInput,
  options: GrandArchiveInitializeOptions = {},
): GrandArchiveMatchState {
  assertGrandArchiveMatchPlayerCount(input.mode, input.players.length);
  const inputIds = input.players.map((player) => player.id);
  if (new Set(inputIds).size !== inputIds.length) throw new Error("Player ids must be unique");
  const firstIndex = inputIds.indexOf(input.firstPlayerId);
  if (firstIndex < 0) throw new Error("The first player must be in the match");
  const orderedSetups = rotateFirst<
    GrandArchiveStandardPlayerSetup | GrandArchiveDraftPlayerSetup | GrandArchivePantheonPlayerSetup
  >(input.players, firstIndex);
  if (options.validateDeckConstruction !== false) {
    for (const setup of orderedSetups) {
      assertGrandArchiveDeckConstruction(
        program,
        input.mode,
        setup,
        input.mode === "draft" && input.mainDeckCopyLimit !== undefined
          ? { draftMainDeckCopyLimit: input.mainDeckCopyLimit }
          : {},
      );
    }
  }
  const turnOrder = orderedSetups.map((player) => grandArchivePlayerId(player.id));
  const players: Record<GrandArchivePlayerId, GrandArchivePlayerState> = {};
  const zones: Record<
    GrandArchivePlayerId,
    Record<GrandArchiveZone, readonly GrandArchiveObjectId[]>
  > = {};
  const objects: Record<GrandArchiveObjectId, GrandArchiveCardInstance> = {};
  const startingChampionIds: Record<GrandArchivePlayerId, GrandArchiveObjectId> = {};
  const pantheonBarrierDefinitionIds: Partial<Record<GrandArchivePlayerId, string>> = {};
  let nextObjectOrdinal = 1;
  let random = { seed: input.randomSeed | 0, cursor: 0 };

  const createObject = (
    definitionId: string,
    ownerId: GrandArchivePlayerId,
    zone: GrandArchiveZone,
  ): GrandArchiveObjectId => {
    const definition = requireGrandArchiveCard(program, definitionId);
    const face = faceOf(definition);
    const id = grandArchiveObjectId(`object-${nextObjectOrdinal}`);
    nextObjectOrdinal += 1;
    objects[id] = {
      id,
      definitionId,
      isToken: definition.definitionKind === "token-representation",
      ownerId,
      baseControllerId: ownerId,
      controllerId: ownerId,
      zone,
      face: "default",
      facing: (GRAND_ARCHIVE_PRIVATE_ZONES as readonly GrandArchiveZone[]).includes(zone)
        ? "face-down"
        : "face-up",
      states: new Set(),
      activationStates: new Set(),
      activationPayment: [],
      activationBindings: {},
      activationVariables: {},
      cascadeCounts: {},
      counters:
        zone === "field" && face.stats.durability !== undefined
          ? { durability: face.stats.durability }
          : {},
      damage: 0,
      incarnation: 1,
      objectVersion: 1,
    };
    zones[ownerId][zone] = [...zones[ownerId][zone], id];
    return id;
  };

  orderedSetups.forEach((setup, turnOrderIndex) => {
    const playerId = turnOrder[turnOrderIndex];
    if (!playerId) throw new Error("Missing player identity");
    const startingMainDefinitions = expandDeck(setup.mainDeck);
    const startingMaterialDefinitions = expandDeck(setup.materialDeck);
    players[playerId] = {
      id: playerId,
      name: setup.name,
      turnOrder: turnOrderIndex,
      startingDeckDefinitionIds: {
        "main-deck": startingMainDefinitions,
        "material-deck": startingMaterialDefinitions,
      },
      hasTakenFirstTurn: false,
      hasControlledChampion: true,
      lost: false,
      conceded: false,
      phaseSkips: {},
      states: {},
    };
    zones[playerId] = createEmptyGrandArchiveZones();

    const championFace = assertCardType(program, setup.startingChampionDefinitionId, "CHAMPION");
    if (championFace.stats.level !== 0) {
      throw new Error(`${setup.startingChampionDefinitionId} must be a level 0 champion`);
    }

    const materialDefinitions = [...startingMaterialDefinitions];
    const championIndex = materialDefinitions.indexOf(setup.startingChampionDefinitionId);
    if (championIndex < 0) throw new Error("Starting champion must be in the material deck");
    materialDefinitions.splice(championIndex, 1);
    for (const definitionId of materialDefinitions)
      createObject(definitionId, playerId, "material-deck");
    startingChampionIds[playerId] = createObject(
      setup.startingChampionDefinitionId,
      playerId,
      options.skipPregameForTests ? "field" : "material-deck",
    );

    const mainObjectIds = startingMainDefinitions.map((definitionId) =>
      createObject(definitionId, playerId, "main-deck"),
    );
    const shuffled = shuffleGrandArchiveObjects(mainObjectIds, random);
    random = shuffled.random;
    zones[playerId]["main-deck"] = shuffled.value;

    if (input.mode === "pantheon") {
      const pantheon = setup.pantheon;
      if (!pantheon) throw new Error("Pantheon setup is required in a Pantheon match");
      assertCardType(program, pantheon.lesserBoonDefinitionId, "LESSER BOON");
      assertCardType(program, pantheon.greaterBoonDefinitionId, "GREATER BOON");
      assertPantheonBarrierDefinition(program, pantheon.barrierDefinitionId);
      createObject(pantheon.lesserBoonDefinitionId, playerId, "pantheon");
      createObject(pantheon.greaterBoonDefinitionId, playerId, "pantheon");
      pantheonBarrierDefinitionIds[playerId] = pantheon.barrierDefinitionId;
      if (options.skipPregameForTests) {
        createObject(pantheon.barrierDefinitionId, playerId, "field");
      }
    }
  });

  const firstPlayerId = turnOrder[0];
  if (!firstPlayerId) throw new Error("A match requires players");
  if (options.skipPregameForTests && input.mode === "pantheon") {
    const deck = zones[firstPlayerId]["main-deck"];
    const drawn = deck[0];
    if (drawn) {
      zones[firstPlayerId]["main-deck"] = deck.slice(1);
      zones[firstPlayerId].hand = [...zones[firstPlayerId].hand, drawn];
      const object = objects[drawn];
      if (!object) throw new Error("Drawn card object is missing");
      objects[drawn] = {
        ...object,
        zone: "hand",
        incarnation: object.incarnation + 1,
        objectVersion: object.objectVersion + 1,
      };
    }
  }
  const startingPhase = "main";
  return {
    schemaVersion: 1,
    programFingerprint: program.fingerprint,
    mode: input.mode satisfies GrandArchiveGameMode,
    status: options.skipPregameForTests ? "playing" : "pregame",
    winnerIds: [],
    gameStates: {},
    stateVersion: 0,
    players,
    turnOrder,
    objects,
    zones,
    sharedZones: { "effects-stack": [] },
    stack: [],
    turn: {
      number: 1,
      playerId: firstPlayerId,
      phase: startingPhase,
      materializeKind: null,
      materializeChoicePending: false,
      recollectionPending: false,
      drawPending: false,
      cleanupPending: false,
      attackAttempts: [],
    },
    pregame: options.skipPregameForTests
      ? null
      : {
          stage: "player-actions",
          currentPlayerIndex: 0,
          startingChampionIds,
          pantheonBarrierDefinitionIds,
        },
    opportunity: options.skipPregameForTests
      ? {
          holderId: firstPlayerId,
          startedById: firstPlayerId,
          passedPlayerIds: [],
          reason: "phase-begin",
        }
      : null,
    decision: null,
    resolution: null,
    replacementFollowUps: [],
    replacementPreCommit: null,
    trackedCharacteristics: {},
    combat: null,
    pendingGameOutcome: null,
    pendingTermination: null,
    random,
    nextObjectOrdinal,
    nextStackOrdinal: 1,
    nextDecisionOrdinal: 1,
    nextEventOrdinal: 1,
    eventHistory: [],
    continuousEffects: [],
    nextContinuousOrdinal: 1,
    replacementEffects: [],
    nextReplacementOrdinal: 1,
    replacementLimitUsages: {},
    ruleModifications: [],
    nextRuleModificationOrdinal: 1,
    pendingTriggers: [],
    nextPendingTriggerOrdinal: 1,
    generatedTriggers: [],
    nextGeneratedTriggerOrdinal: 1,
    delayedTriggers: [],
    nextDelayedTriggerOrdinal: 1,
  };
}
