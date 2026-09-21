import {
  DEFAULT_HERO_INTELLECT,
  fabCreatedObjectCanonicalId,
  registerFabCardDefinition,
  type FabCardDefinitionInput,
  type FabRegisteredCardDefinition,
} from "./cards.ts";
import { nextRandom, seedFromString, shuffleWith, type FabPrngState } from "./random.ts";
import {
  FAB_MATCH_SCHEMA_VERSION,
  createEmptyFabZones,
  opponentOf,
  type FabMatchState,
  type FabObjectRecord,
  type FabPlayerState,
  type FabZoneKind,
  FAB_DEFAULT_AUTOMATION_PREFERENCES,
  type FabAutomationPreferences,
} from "./state.ts";
import {
  applySharedLibraryMerge,
  heroSharesLibrary,
  libraryPlayerId,
} from "./rules/shared-library.ts";
import {
  fabCanonicalCardId,
  fabObjectInstanceId,
  fabPlayerId,
  type FabPlayerId,
} from "./game/identity.ts";
import { normalizeFabPublicCardIdentities } from "./match-program.ts";
import { initialFabActiveFace } from "./game/active-face.ts";
import { emptyFabTurnHistory } from "./game/turn-history.ts";

/**
 * Per-match instance map carried by the play module. Mirrors the shared
 * `CardsMaps` shape without forcing a cross-workspace import.
 */
export interface FabCardsMaps {
  canonicalIdsByInstance: Record<string, string>;
  owners: Record<string, string[]>;
}

export interface InitializeFabMatchInput {
  seed: string;
  /** Seat A. Product scope is 1v1 only — exactly two distinct seats. */
  player1Id: string;
  /** Seat B. Product scope is 1v1 only — exactly two distinct seats. */
  player2Id: string;
  cardsMaps: FabCardsMaps;
  /** Starting hero life. Defaults to 20 for the boilerplate. */
  startingLife?: number;
  /** Hero canonical card id per player, if seated. */
  heroes?: Partial<Record<string, string>>;
  /**
   * Player who takes the first turn. Defaults to player1.
   * The chosen player begins with the persisted turn-1 Start Phase procedure.
   */
  firstPlayerId?: string;
  /** Printed card stats keyed by canonical id. */
  cardDefinitions?: Record<string, FabCardDefinitionInput>;
  /** Global public catalog used by name-card decisions; never deck-scoped. */
  publicCardIdentities: readonly import("@tcg/flesh-and-blood-types").FabPublicCardIdentity[];
  /** Per-player intellect override (defaults from hero definition or 4). */
  intellect?: Partial<Record<string, number>>;
  /**
   * CR 1.5.1–1.5.3 Macros: format-selected canonical ids per player.
   * Macro objects are created in the arena before hero seating and their
   * staticKind "meta" abilities are executed during initialization.
   */
  macros?: Partial<Record<string, readonly string[]>>;
  /** Final deck instance ids after the FAB start-of-game selection. */
  deckInstanceIds?: Partial<Record<string, readonly string[]>>;
  /** Unselected cards remain owned, private inventory throughout the game. */
  inventoryInstanceIds?: Partial<Record<string, readonly string[]>>;
  /** Arena cards selected during CR 4.1.4, keyed by their equipped zone. */
  startingArena?: Partial<
    Record<
      string,
      Partial<
        Record<
          Extract<FabZoneKind, "head" | "chest" | "arms" | "legs" | "weapon1" | "weapon2">,
          readonly string[]
        >
      >
    >
  >;
  /**
   * When true, skip Yorick-style shared-library merge (fixtures relocate
   * per-seat decks after init and apply the merge themselves).
   */
  skipSharedLibrary?: boolean;
  /**
   * Per-seat automation-preference seed (platform account defaults). Each
   * seated seat's partial profile merges over the fail-closed defaults;
   * missing seats fail closed entirely.
   */
  automationPreferences?: Readonly<Partial<Record<string, Partial<FabAutomationPreferences>>>>;
  /**
   * Per-seat optional-trigger auto-decline seed keyed by canonical card id
   * (platform account defaults). Canonical ids are mapped onto instances the
   * seat actually owns at creation; unknown ids, non-owned instances, and
   * unseated seats are dropped (fail-closed = "ask").
   */
  optionalTriggerDeclines?: Readonly<Partial<Record<string, Readonly<Record<string, true>>>>>;
  /** Same mapping as optionalTriggerDeclines, but automatically uses the effect. */
  optionalTriggerAccepts?: Readonly<Partial<Record<string, Readonly<Record<string, true>>>>>;
  /** White-box kernel tests may opt out; production matches always run turn 1's Start Phase. */
  skipInitialStartPhase?: boolean;
}

export const DEFAULT_FAB_STARTING_LIFE = 20;

/**
 * Build the production initial state for a fresh FAB match. Each player's deck
 * (from `cardsMaps.owners`) is shuffled deterministically using the seed, and
 * `stateID` starts at 0. The first player begins in the Start Phase (CR 4.1.9
 * and 4.2); the Action Phase grants 1 action point only after start-of-turn
 * triggers have resolved (CR 4.3.2).
 *
 * **Product scope is 1v1 only** — exactly two distinct seated players.
 * Multiplayer seating is not supported.
 *
 * @remarks
 * This is the engine bootstrap used by the server adapter and test-fixture
 * implementation. Test files must not import this module directly: use
 * {@link FabTestEngine.start} for scenarios, or
 * `FabTestEngine.createStateForRulesTest` only when the state record itself
 * is the unit under test.
 */
export function createFabMatchInitialState(input: InitializeFabMatchInput): FabMatchState {
  if (!input.player1Id || !input.player2Id) {
    throw new Error("createFabMatchInitialState requires player1Id and player2Id.");
  }
  if (input.player1Id === input.player2Id) {
    throw new Error(
      `createFabMatchInitialState requires two distinct seats (1v1); got "${input.player1Id}" twice.`,
    );
  }
  const playerIds: readonly [FabPlayerId, FabPlayerId] = [
    fabPlayerId(input.player1Id),
    fabPlayerId(input.player2Id),
  ];
  const firstPlayerId = input.firstPlayerId ?? input.player1Id;
  if (!playerIds.some((playerId) => playerId === firstPlayerId)) {
    throw new Error(
      `createFabMatchInitialState firstPlayerId must identify a seated player; got "${firstPlayerId}".`,
    );
  }
  const heroCanonicalIdsByInstance: Record<string, string> = {};
  const publicCardIdentities = normalizeFabPublicCardIdentities(input.publicCardIdentities);
  let rngState: FabPrngState = seedFromString(input.seed);
  const cardDefinitions: Record<string, FabRegisteredCardDefinition> = Object.fromEntries(
    Object.entries(input.cardDefinitions ?? {}).map(([canonicalId, definition]) => [
      canonicalId,
      registerFabCardDefinition(definition),
    ]),
  );

  const players: Record<string, FabPlayerState> = {};
  const containers: FabMatchState["containers"] = {
    zonesByPlayerId: {},
    arsenalZonesByPlayerId: {},
    subcardsByHostId: {},
  };
  for (const playerId of playerIds) {
    const owned = input.deckInstanceIds?.[playerId] ?? input.cardsMaps.owners[playerId] ?? [];
    const heroCanonicalId = input.heroes?.[playerId] ?? null;
    const ownedHeroInstanceId = heroCanonicalId
      ? (input.cardsMaps.owners[playerId] ?? []).find(
          (instanceId) => input.cardsMaps.canonicalIdsByInstance[instanceId] === heroCanonicalId,
        )
      : undefined;
    const heroInstanceId = heroCanonicalId ? (ownedHeroInstanceId ?? `fab-hero:${playerId}`) : null;
    if (heroInstanceId && heroCanonicalId) {
      heroCanonicalIdsByInstance[heroInstanceId] = heroCanonicalId;
    }
    const shuffled = shuffleWith(
      heroInstanceId ? owned.filter((instanceId) => instanceId !== heroInstanceId) : [...owned],
      rngState,
    );
    rngState = shuffled.state;
    const zones = createEmptyFabZones();
    zones.deck = shuffled.array;
    zones.inventory = [...(input.inventoryInstanceIds?.[playerId] ?? [])];
    const selectedArena = input.startingArena?.[playerId];
    if (selectedArena) {
      for (const zone of ["head", "chest", "arms", "legs", "weapon1", "weapon2"] as const) {
        zones[zone] = [...(selectedArena[zone] ?? [])];
      }
    }

    if (heroInstanceId) zones.heroZone = [heroInstanceId];
    containers.zonesByPlayerId[playerId] = zones;
    containers.arsenalZonesByPlayerId[playerId] = [{ id: `arsenal:${playerId}:0`, cardId: null }];
    const heroDef = heroCanonicalId ? cardDefinitions[heroCanonicalId] : undefined;
    const life = input.startingLife ?? heroDef?.base.numeric.life ?? DEFAULT_FAB_STARTING_LIFE;
    const intellect =
      input.intellect?.[playerId] ?? heroDef?.base.numeric.intellect ?? DEFAULT_HERO_INTELLECT;

    players[playerId] = {
      playerId,
      heroCardId: heroInstanceId,
      life,
      actionPoints: 0,
      resourcePoints: 0,
      intellect,
      marked: false,
      extraTurnsQueued: 0,
      activeContract: null,
      history: {
        game: { startedAtTurn: 1, diplomacyChoice: null },
        turn: emptyFabTurnHistory(1),
        combatChain: {
          combatNumber: null,
          draconicChainLinks: 0,
          wagered: false,
          lastAttackNames: [],
          lastAttackDidHit: false,
          boostsThisCombatChain: 0,
          cardsBanishedFromSoulThisCombatChain: 0,
        },
        chainLink: {
          chainLinkNumber: null,
          playedInstant: false,
          damageDealtByType: { arcane: 0, physical: 0, generic: 0 },
          damageDealtToOpposingHeroesByType: { arcane: 0, physical: 0, generic: 0 },
          damageDealtBySource: {},
          damageDealtBySourceToHero: {},
        },
        resolution: { processId: null },
      },
      intimidatedInstanceIds: [],
      pendingCrankInstanceIds: [],
      chiPoints: 0,
    };
  }

  const activePlayerId = fabPlayerId(firstPlayerId);

  // Every seated seat carries an explicit profile (default for unseeded seats);
  // unseated keys are dropped so snapshot validation never sees them.
  const automationPreferences: Record<string, FabAutomationPreferences> = {};
  for (const playerId of playerIds) {
    automationPreferences[playerId] = { ...FAB_DEFAULT_AUTOMATION_PREFERENCES };
  }
  for (const [playerId, preferences] of Object.entries(input.automationPreferences ?? {})) {
    if (preferences && playerIds.some((seatedId) => seatedId === playerId)) {
      automationPreferences[playerId] = {
        ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
        ...preferences,
      };
    }
  }

  // Map each seated seat's saved canonical ids onto the instances it owns;
  // owned instances are exactly the ones that become objects, so the seeded
  // keys always satisfy snapshot validation. Everything else drops to "ask".
  const optionalTriggerAutomation: FabMatchState["optionalTriggerAutomation"] = {};
  for (const playerId of playerIds) {
    const declines = input.optionalTriggerDeclines?.[playerId];
    const accepts = input.optionalTriggerAccepts?.[playerId];
    if (!declines && !accepts) continue;
    const instances: FabMatchState["optionalTriggerAutomation"][string] = {};
    for (const instanceId of input.cardsMaps.owners[playerId] ?? []) {
      const canonicalId = input.cardsMaps.canonicalIdsByInstance[instanceId];
      if (canonicalId && accepts?.[canonicalId] === true) {
        instances[instanceId] = "auto-accept";
      } else if (canonicalId && declines?.[canonicalId] === true) {
        instances[instanceId] = "auto-decline";
      }
    }
    if (Object.keys(instances).length > 0) {
      optionalTriggerAutomation[playerId] = instances;
    }
  }

  // Yorick et al.: merge starting decks before opening hands so both seats draw
  // from the communal library.
  let sharedLibraryHostId: string | null = null;
  const sharesLibrary =
    !input.skipSharedLibrary &&
    playerIds.some((playerId) => {
      const heroId = input.heroes?.[playerId];
      return heroId ? heroSharesLibrary(cardDefinitions[heroId]) : false;
    });
  if (sharesLibrary) {
    // Host = first player seat (stable); merge uses the same PRNG stream.
    const provisional: FabMatchState = {
      schemaVersion: FAB_MATCH_SCHEMA_VERSION,
      playerIds,
      players,
      containers,
      objects: {},
      attackProxies: {},
      lkiArena: {},
      cardDefinitions,
      publicCardIdentities,
      firstTurnPlayerId: activePlayerId,
      activePlayerId,
      priority: {
        kind: "action",
        holderPlayerId: activePlayerId,
        combatStep: null,
        consecutivePasses: 0,
      },
      turnNumber: 1,
      phase: "action",
      combat: null,
      lastClosedCombat: null,
      decision: null,
      rulesProcess: null,
      counters: {
        process: 0,
        event: 0,
        batch: 0,
        layer: 0,
        decision: 0,
        effect: 0,
        timestamp: 0,
        checkpoint: 0,
        objectIncarnation: 0,
      },
      triggerLimitUsage: {},
      optionalTriggerAutomation: cloneOptionalTriggerAutomation(optionalTriggerAutomation),
      automationPreferences: { ...automationPreferences },
      priorityHoldArmed: {},
      triggerOccurrenceLedger: [],
      abilityLimitUsage: {},
      activationLimitModifiers: [],
      delayedTriggers: [],
      replacementEffects: [],
      continuousEffectInstances: [],
      continuousOrderingDecisions: [],
      rulesStack: [],
      stateID: 0,
      gameEnded: false,
      winnerId: null,
      endReason: null,
      sharedLibraryHostId: null,
      seed: input.seed,
      rngState,
      lastClashWinnerId: null,
    };
    rngState = applySharedLibraryMerge(provisional, input.player1Id, rngState);
    sharedLibraryHostId = provisional.sharedLibraryHostId;
  }

  // CR 4.1.9: each player draws to their seated hero's intellect once the
  // start-of-game procedure has equipped arena cards and set up decks.
  for (const playerId of playerIds) {
    drawCards({ players, containers, sharedLibraryHostId }, playerId, players[playerId]!.intellect);
  }

  const ownerIdsByInstance: Record<string, string> = Object.fromEntries(
    Object.entries(input.cardsMaps.owners).flatMap(([ownerId, instanceIds]) =>
      instanceIds.map((instanceId) => [instanceId, ownerId] as const),
    ),
  );
  for (const playerId of playerIds) {
    const heroCardId = players[playerId]?.heroCardId;
    if (heroCardId) ownerIdsByInstance[heroCardId] = playerId;
  }
  let objectIncarnation = 0;
  const objects: Record<string, FabObjectRecord> = {};
  const physicalInstanceIds = new Set(Object.keys(input.cardsMaps.canonicalIdsByInstance));
  for (const playerId of playerIds) {
    const heroCardId = players[playerId]?.heroCardId;
    if (heroCardId) physicalInstanceIds.add(heroCardId);
  }
  for (const instanceId of [...physicalInstanceIds].sort()) {
    const ownerId = ownerIdsByInstance[instanceId];
    if (!ownerId) {
      throw new Error(`FAB object ${instanceId} has no owner in schema-v2 initialization.`);
    }
    objectIncarnation += 1;
    // Arsenal cards begin face-down (CR 3.3). This must be state, not a
    // fixture-only convention: effects such as Smash Up turn the selected
    // arsenal card face-up before their next sequence step resolves.
    const startsInArsenal = Object.values(containers.zonesByPlayerId).some((zones) =>
      zones.arsenal.includes(instanceId),
    );
    const startsInHeroZone = Object.values(containers.zonesByPlayerId).some((zones) =>
      zones.heroZone.includes(instanceId),
    );
    const canonicalId = fabCanonicalCardId(
      input.cardsMaps.canonicalIdsByInstance[instanceId] ??
        heroCanonicalIdsByInstance[instanceId] ??
        instanceId,
    );
    const definition = cardDefinitions[canonicalId];
    objects[instanceId] = {
      instanceId: fabObjectInstanceId(instanceId),
      canonicalId,
      objectKind: "catalog-card",
      baseSource: { kind: "registered" },
      ownerId: fabPlayerId(ownerId),
      incarnation: objectIncarnation,
      visibility: initialObjectVisibility(containers.zonesByPlayerId, instanceId),
      activeFace: definition
        ? initialFabActiveFace(definition, startsInHeroZone ? "inside" : "outside")
        : { kind: "single" },
      cardPropertyState: { kind: "whole-card" },
      counters: [],
      markers: startsInArsenal ? [{ kind: "face-down" }] : [],
      history: { moves: [] },
    };
  }

  // CR 1.5.1–1.5.3: Create format-selected Macro objects and seed their
  // meta-ability tokens. Macros are placed in the controller's arena zone
  // with a macro marker and execute `staticKind: "meta"` effects such as
  // create-token during initialization.
  for (const playerId of playerIds) {
    const playerMacros = input.macros?.[playerId] ?? [];
    for (const canonicalId of playerMacros) {
      const def = cardDefinitions[canonicalId];
      if (!def) continue;
      objectIncarnation += 1;
      const instanceId = `fab-macro-${playerId}-${canonicalId.substring(0, 8)}`;
      containers.zonesByPlayerId[playerId]!.arena.push(instanceId);
      objects[instanceId] = {
        instanceId: fabObjectInstanceId(instanceId),
        canonicalId: fabCanonicalCardId(canonicalId),
        objectKind: "macro",
        baseSource: { kind: "registered" },
        ownerId: fabPlayerId(playerId),
        incarnation: objectIncarnation,
        visibility: "public",
        activeFace: initialFabActiveFace(def, "inside"),
        cardPropertyState: { kind: "whole-card" },
        counters: [],
        markers: [],
        history: { moves: [] },
      };
    }
  }

  // Execute Macro meta abilities. Currently handles create-token with
  // controller "each" or "self" (defaults to controller player).
  const seededMacroTokens = new Set<string>(); // "playerId:canonicalId"
  for (const playerId of playerIds) {
    const playerMacros = input.macros?.[playerId] ?? [];
    for (const canonicalId of playerMacros) {
      const def = cardDefinitions[canonicalId];
      if (!def) continue;
      for (const ability of def.base.abilities) {
        if (ability.kind !== "static") continue;
        if (ability.staticKind !== "meta") continue;
        const effect = ability.effect;
        if (!effect || effect.type !== "create-token") continue;
        const tokenCanonicalId: string | undefined =
          typeof effect.token === "string"
            ? resolveTokenCanonicalId(effect.token, cardDefinitions)
            : undefined;
        if (!tokenCanonicalId) continue;
        const controller = effect.controller as string | undefined;
        const targetPlayerIds: readonly string[] = controller === "each" ? playerIds : [playerId];
        for (const targetId of targetPlayerIds) {
          const key = `${targetId}:${tokenCanonicalId}`;
          if (seededMacroTokens.has(key)) continue;
          seededMacroTokens.add(key);
          objectIncarnation += 1;
          const tokenInstanceId = `fab-macro-token-${String(objectIncarnation).padStart(4, "0")}`;
          containers.zonesByPlayerId[targetId]!.arena.push(tokenInstanceId);
          objects[tokenInstanceId] = {
            instanceId: fabObjectInstanceId(tokenInstanceId),
            canonicalId: fabCanonicalCardId(tokenCanonicalId),
            objectKind: "created-token",
            baseSource: { kind: "registered" },
            ownerId: fabPlayerId(targetId),
            incarnation: objectIncarnation,
            visibility: "public",
            activeFace: initialFabActiveFace(cardDefinitions[tokenCanonicalId]!, "inside"),
            cardPropertyState: { kind: "whole-card" },
            counters: [],
            markers: [],
            history: { moves: [] },
          };
        }
      }
    }
  }

  const initialState: FabMatchState = {
    schemaVersion: FAB_MATCH_SCHEMA_VERSION,
    playerIds,
    players,
    containers,
    objects,
    attackProxies: {},
    lkiArena: {},
    cardDefinitions,
    publicCardIdentities,
    firstTurnPlayerId: activePlayerId,
    activePlayerId,
    priority: {
      kind: "action",
      holderPlayerId: activePlayerId,
      combatStep: null,
      consecutivePasses: 0,
    },
    turnNumber: 1,
    phase: "start",
    combat: null,
    lastClosedCombat: null,
    decision: null,
    rulesProcess: null,
    counters: {
      process: 0,
      event: 0,
      batch: 0,
      layer: 0,
      decision: 0,
      effect: 0,
      timestamp: 0,
      checkpoint: 0,
      objectIncarnation,
    },
    triggerLimitUsage: {},
    optionalTriggerAutomation: cloneOptionalTriggerAutomation(optionalTriggerAutomation),
    automationPreferences: { ...automationPreferences },
    priorityHoldArmed: {},
    triggerOccurrenceLedger: [],
    abilityLimitUsage: {},
    activationLimitModifiers: [],
    delayedTriggers: [],
    replacementEffects: [],
    continuousEffectInstances: [],
    continuousOrderingDecisions: [],
    rulesStack: [],
    stateID: 0,
    gameEnded: false,
    winnerId: null,
    endReason: null,
    seed: input.seed,
    rngState,
    lastClashWinnerId: null,
    sharedLibraryHostId,
  };
  if (input.skipInitialStartPhase) {
    initialState.phase = "action";
    initialState.players[activePlayerId]!.actionPoints = 1;
  }
  return initialState;
}

function cloneOptionalTriggerAutomation(
  source: FabMatchState["optionalTriggerAutomation"],
): FabMatchState["optionalTriggerAutomation"] {
  const clone: FabMatchState["optionalTriggerAutomation"] = {};
  for (const [playerId, instances] of Object.entries(source)) {
    clone[playerId] = { ...instances };
  }
  return clone;
}

function initialObjectVisibility(
  zonesByPlayerId: Readonly<FabMatchState["containers"]["zonesByPlayerId"]>,
  instanceId: string,
): "public" | "private" {
  for (const zones of Object.values(zonesByPlayerId)) {
    for (const zone of ["deck", "hand", "arsenal"] as const) {
      if (zones[zone].includes(instanceId)) return "private";
    }
  }
  return "public";
}

/**
 * Resolve a token slug to its canonical id from registered card definitions.
 * Tokens are stored under `token:${slug}` keys by the test fixture registry.
 * Returns the canonical id and ensures it is also registered under that key.
 */
function resolveTokenCanonicalId(
  slug: string,
  cardDefinitions: Record<string, FabRegisteredCardDefinition>,
): string | undefined {
  const key = fabCreatedObjectCanonicalId(slug);
  const def = cardDefinitions[key];
  if (!def) return undefined;
  // Ensure the definition is also accessible by its canonicalId.
  cardDefinitions[def.canonicalId] ??= def;
  return def.canonicalId;
}

/** Draw `count` cards from a player's deck into their hand, mutating state. */
export function drawCards(
  state: Pick<FabMatchState, "players" | "containers" | "sharedLibraryHostId">,
  playerId: string,
  count: number,
): void {
  const player = state.players[playerId];
  if (!player) return;
  const deckOwnerId = libraryPlayerId(
    { sharedLibraryHostId: state.sharedLibraryHostId ?? null },
    playerId,
    "deck",
  );
  const deck = state.containers.zonesByPlayerId[deckOwnerId]?.deck;
  const hand = state.containers.zonesByPlayerId[playerId]?.hand;
  if (!deck || !hand) return;
  for (let i = 0; i < count; i++) {
    const card = deck.pop();
    if (card) hand.push(card);
  }
}

/** Convenience RNG roll helper that advances the match's PRNG state. */
export function rollMatchRandom(state: FabMatchState): number {
  const result = nextRandom(state.rngState);
  state.rngState = result.state;
  return result.value;
}

export { opponentOf };
