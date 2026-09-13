import { getPlayGameConfig } from "@tcg/shared/game-adapter";
import { readFabClock, fabRemainingMs } from "./clock.ts";
import { riptideLurkerOfTheDeep } from "@tcg/flesh-and-blood-cards/cards/heroes/riptide-lurker-of-the-deep";
import { deathDealer } from "@tcg/flesh-and-blood-cards/cards/weapons/death-dealer";
import { driftwoodQuiver } from "@tcg/flesh-and-blood-cards/cards/equipment/driftwood-quiver";
import { browbeatBlue } from "@tcg/flesh-and-blood-cards/cards/actions/browbeat";
import { describe, expect, it, vi } from "vitest";
import {
  FleshAndBloodServerEngine,
  fleshAndBloodServerAdapter,
  registerFleshAndBloodServerAdapter,
} from "./index.ts";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import type {
  FabPlayerLog,
  FabViewerState,
  FabVisiblePlayerLog,
} from "@tcg/flesh-and-blood-engine/runtime";
import { toFabCardDefinition } from "@tcg/flesh-and-blood-engine/runtime";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "@tcg/flesh-and-blood-engine/automation";
import type { CardsMaps, DeckBuildInput } from "@tcg/shared/game-adapter";
import { selectVisibleEngineLogForViewer } from "@tcg/shared/game-engine";
import { buildFabEngineCardDefinitions, classifyFabStartingCards } from "./engine-lifecycle.ts";
import { buildInteractionSubmission, buildInteractionSubmissionForActionId } from "@tcg/protocol";

const PLAYER_1 = "fab-p1";
const PLAYER_2 = "fab-p2";

/** Real card ids so createServerEngine can populate cardDefinitions. */
const ALPHA_RAMPAGE_CANONICAL = "GgDFFHhLh8Kc7tJK8nBLj";
const ALPHA_RAMPAGE_SLUG = "alpha-rampage-red";
const DASH_YOUNG_CANONICAL = "kftPnNkrBLJ7rPmFGgQCm";
const MASSACRE_RED_CANONICAL = "dGqFDHg9FqzfbDcNcLPtP";
const NIMBLISM_RED_CANONICAL = "8gDnjCfGbwdzrRztkMJJG";
/** Dromai, Ash Artist and her shared Dromai/Fai specialization Red Hot. */
const DROMAI_ASH_ARTIST_CANONICAL = "PrJkWBKNgtNdzhqhWLGFw";
const RED_HOT_CANONICAL = "GRJN6ctjz9wPmFn9K7WHn";
/** Copper Cog (SEA021) — carries the Unlimited keyword (CR 8.3.40). */
const COPPER_COG_BLUE_CANONICAL = "kzBc7Bmrk7TfHNwhQK6Lj";
/** Blue Nimblism pitch-3 variant (catalog and structured slug). */
const NIMBLISM_BLUE_SLUG = "nimblism-blue";

const ADAPTER_TEST_HERO_1 = {
  canonicalId: "test:adapter-hero-one",
  name: "Adapter Hero One",
  types: ["Hero"],
  health: 20,
  intelligence: 4,
} as const;
const ADAPTER_TEST_HERO_2 = {
  canonicalId: "test:adapter-hero-two",
  name: "Adapter Hero Two",
  types: ["Hero"],
  health: 20,
  intelligence: 4,
} as const;
const ADAPTER_TEST_CARD = {
  canonicalId: "test:adapter-draw-card",
  name: "Adapter Draw Card",
  types: ["Action"],
} as const;

/** A named three-card deck so draw-identity canaries are meaningful. */
const namedDeck = (): (typeof ADAPTER_TEST_CARD)[] => [
  ADAPTER_TEST_CARD,
  ADAPTER_TEST_CARD,
  ADAPTER_TEST_CARD,
];

function playerNarrative(value: unknown): FabPlayerLog {
  expect(value).toMatchObject({ kind: "player-narrative", schemaVersion: 1 });
  return value as FabPlayerLog;
}

function visiblePlayerNarrative(value: unknown): FabVisiblePlayerLog {
  expect(value).toMatchObject({ kind: "player-narrative", schemaVersion: 1 });
  return value as FabVisiblePlayerLog;
}

function buildCardsMaps(p1CardId = ALPHA_RAMPAGE_SLUG, p2CardId = NIMBLISM_BLUE_SLUG): CardsMaps {
  const decks: ReadonlyArray<DeckBuildInput> = [
    { owner: PLAYER_1, deck: [{ cardId: p1CardId, qty: 3 }] },
    { owner: PLAYER_2, deck: [{ cardId: p2CardId, qty: 3 }] },
  ];
  return fleshAndBloodServerAdapter.buildCardInstances(decks);
}

describe("fleshAndBloodServerAdapter", () => {
  it("exposes the slug and engine lifecycle (server-authoritative)", () => {
    expect(fleshAndBloodServerAdapter.slug).toBe("flesh-and-blood");
    expect(fleshAndBloodServerAdapter.createServerEngine).toBeTypeOf("function");
    expect(fleshAndBloodServerAdapter.serializeEngine).toBeTypeOf("function");
    expect(fleshAndBloodServerAdapter.restoreEngine).toBeTypeOf("function");
  });

  it("builds per-owner instance maps", () => {
    const maps = buildCardsMaps();
    expect(maps.owners[PLAYER_1]).toHaveLength(3);
    expect(maps.owners[PLAYER_2]).toHaveLength(3);
    expect(Object.values(maps.cardInstances)).toEqual([
      ALPHA_RAMPAGE_SLUG,
      ALPHA_RAMPAGE_SLUG,
      ALPHA_RAMPAGE_SLUG,
      NIMBLISM_BLUE_SLUG,
      NIMBLISM_BLUE_SLUG,
      NIMBLISM_BLUE_SLUG,
    ]);
  });

  it("projects canonical Hero identities and scopes choices to the queue format", () => {
    const identity = fleshAndBloodServerAdapter.matchmakingIdentity?.getDeckIdentity([
      { cardId: DASH_YOUNG_CANONICAL, quantity: 1 },
    ]);
    expect(identity).toMatchObject({ id: DASH_YOUNG_CANONICAL });

    const blitzHeroes =
      fleshAndBloodServerAdapter.matchmakingIdentity?.listOpponentIdentities("blitz") ?? [];
    const ccHeroes =
      fleshAndBloodServerAdapter.matchmakingIdentity?.listOpponentIdentities("cc") ?? [];
    expect(blitzHeroes).toContainEqual(expect.objectContaining({ id: DASH_YOUNG_CANONICAL }));
    expect(ccHeroes).not.toContainEqual(expect.objectContaining({ id: DASH_YOUNG_CANONICAL }));
    expect(
      fleshAndBloodServerAdapter.matchmakingIdentity?.listOpponentIdentities("unknown"),
    ).toEqual([]);
    // CDN-only payloads: hero identity art resolves through the first-party
    // content-addressed asset, never the catalog's upstream provider URL.
    expect(identity?.imageUrl).toMatch(
      /^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/full\/[a-f0-9]{64}\.webp$/,
    );
    for (const hero of blitzHeroes.slice(0, 25)) {
      if (hero.imageUrl === null) continue;
      expect(hero.imageUrl).toMatch(
        /^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/full\/[a-f0-9]{64}\.webp$/,
      );
    }
  });

  it("serves CDN-only card summaries from getCardById", () => {
    const summary = fleshAndBloodServerAdapter.getCardById(DASH_YOUNG_CANONICAL);
    expect(summary).not.toBeNull();
    expect(summary?.imageUrl).toMatch(
      /^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/full\/[a-f0-9]{64}\.webp$/,
    );
    expect(fleshAndBloodServerAdapter.getCardById("not-a-real-fab-card")).toBeNull();
  });

  it.each([
    ["cc", "Classic Constructed", "bravo-showstopper"],
    ["silverAge", "Silver Age", "dash"],
    ["ll", "Living Legend", "bravo-showstopper"],
    ["blitz", "Blitz", "dash"],
    ["shapeshifter", "Shapeshifter", "dash"],
  ] as const)("configures %s pregame validation", (formatId, label, heroId) => {
    const result = fleshAndBloodServerAdapter.validateDeckForFormat(formatId, [
      { cardId: heroId, quantity: 1 },
    ]);
    expect(result.label).toBe(label);
    expect(result.rules).not.toContainEqual(
      expect.objectContaining({ kind: "fab-pregame-format", passed: false }),
    );
  });

  it("accepts a multi-hero specialization for either printed hero", () => {
    const result = fleshAndBloodServerAdapter.validateDeckForFormat("cc", [
      { cardId: DROMAI_ASH_ARTIST_CANONICAL, quantity: 1 },
      { cardId: RED_HOT_CANONICAL, quantity: 1 },
    ]);

    expect(result.rules).toContainEqual(
      expect.objectContaining({ kind: "fab-specialization", passed: true }),
    );
  });

  it("persists only stable card data and hydrates definitions after a JSON round trip", () => {
    const pregame = fleshAndBloodServerAdapter.pregame;
    expect(pregame).toBeDefined();
    if (!pregame) throw new Error("Expected Flesh and Blood pregame adapter");
    const pool = pregame.createPool({
      formatId: "cc",
      mainDeck: [
        { cardId: "rhinar-reckless-rampage", quantity: 1 },
        { cardId: ALPHA_RAMPAGE_CANONICAL, quantity: 60 },
      ],
      inventory: [],
    });
    expect(pool).toMatchObject({
      schemaVersion: 2,
      format: "cc",
      heroId: expect.any(String),
      heroName: "Rhinar, Reckless Rampage",
    });
    expect(pool).not.toHaveProperty("cardDefinitions");
    const persistedPool = JSON.parse(JSON.stringify(pool)) as unknown;
    expect(pregame.parsePool(persistedPool)).toEqual(pool);
    const playerPool = pregame.projectPoolForPlayer(pregame.parsePool(persistedPool));
    expect(playerPool).toHaveProperty("cardDefinitions");
    expect(JSON.parse(JSON.stringify(playerPool))).toEqual(playerPool);
    const selection = pregame.createDefaultSelection(persistedPool);

    expect(pregame.validateSelection(persistedPool, selection).valid).toBe(true);
    expect(pregame.materializeDeck(persistedPool, selection)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ cardId: ALPHA_RAMPAGE_CANONICAL, qty: 60 }),
      ]),
    );
  });

  it("materializes and reconciles a persisted reverse-order bow and quiver without losing inventory", () => {
    const pregame = fleshAndBloodServerAdapter.pregame;
    if (!pregame) throw new Error("Expected FAB pregame");
    const pool = pregame.createPool({
      formatId: "shapeshifter",
      mainDeck: [
        { cardId: riptideLurkerOfTheDeep.canonicalId, quantity: 1 },
        { cardId: browbeatBlue.canonicalId, quantity: 30 },
      ],
      inventory: [
        { cardId: driftwoodQuiver.canonicalId, quantity: 1 },
        { cardId: deathDealer.canonicalId, quantity: 1 },
      ],
    });
    const saved: unknown = JSON.parse(
      JSON.stringify({
        equipment: { weapon1: driftwoodQuiver.canonicalId, weapon2: deathDealer.canonicalId },
        deck: [{ canonicalId: browbeatBlue.canonicalId, quantity: 30 }],
      }),
    );
    const selection = pregame.parseSelection(saved);
    expect(pregame.validateSelection(pool, selection).valid).toBe(true);
    const canonical = { weapon1: deathDealer.canonicalId, weapon2: driftwoodQuiver.canonicalId };
    expect(pregame.reconcileSelection(pool, selection).selection).toMatchObject({
      equipment: canonical,
    });
    const deck = pregame.materializeDeck(pool, selection);
    expect(deck).toContainEqual(
      expect.objectContaining({ cardId: deathDealer.canonicalId, qty: 1, sectionId: "weapon1" }),
    );
    expect(deck).toContainEqual(
      expect.objectContaining({
        cardId: driftwoodQuiver.canonicalId,
        qty: 1,
        sectionId: "weapon2",
      }),
    );
    expect(deck.reduce((sum, entry) => sum + entry.qty, 0)).toBe(33);
  });

  it("rejects legacy or runtime-enriched pregame pools at the persistence boundary", () => {
    const pregame = fleshAndBloodServerAdapter.pregame;
    if (!pregame) throw new Error("Expected Flesh and Blood pregame adapter");

    expect(() =>
      pregame.parsePool({
        schemaVersion: 1,
        format: "cc",
        heroId: "hero",
        heroName: "Hero",
        entries: [],
        cardDefinitions: {},
      }),
    ).toThrow("Invalid persisted FAB pregame card pool");
  });

  it("enforces the current one-copy Blitz limit", () => {
    const result = fleshAndBloodServerAdapter.validateDeckForFormat("blitz", [
      { cardId: DASH_YOUNG_CANONICAL, quantity: 1 },
      { cardId: NIMBLISM_RED_CANONICAL, quantity: 40 },
    ]);
    expect(result.valid).toBe(false);
    expect(result.rules).toContainEqual(
      expect.objectContaining({ kind: "fab-copy-limit", passed: false }),
    );
  });

  it("exempts Unlimited-keyword cards (CR 8.3.40) from the copy limit", () => {
    // Copper Cog has the Unlimited keyword — a deck may contain any number.
    const result = fleshAndBloodServerAdapter.validateDeckForFormat("blitz", [
      { cardId: DASH_YOUNG_CANONICAL, quantity: 1 },
      { cardId: COPPER_COG_BLUE_CANONICAL, quantity: 12 },
    ]);
    const copyLimitRules = result.rules.filter((rule) => rule.kind === "fab-copy-limit");
    expect(copyLimitRules.length).toBeGreaterThan(0);
    expect(copyLimitRules.every((rule) => rule.passed)).toBe(true);
  });

  it("requires Silver Age cards to have a Basic, Common, or Rare printing", () => {
    const result = fleshAndBloodServerAdapter.validateDeckForFormat("silverAge", [
      { cardId: DASH_YOUNG_CANONICAL, quantity: 1 },
      { cardId: ALPHA_RAMPAGE_CANONICAL, quantity: 40 },
    ]);
    expect(result.valid).toBe(false);
    expect(result.rules).toContainEqual(
      expect.objectContaining({ kind: "fab-rarity", passed: false }),
    );
  });

  it("allows Shapeshifter's unlimited copies and cross-class card pool", () => {
    const result = fleshAndBloodServerAdapter.validateDeckForFormat("shapeshifter", [
      { cardId: DASH_YOUNG_CANONICAL, quantity: 1 },
      { cardId: MASSACRE_RED_CANONICAL, quantity: 30 },
    ]);
    expect(result.valid).toBe(true);
  });

  it("excludes inventory from the Blitz deck-size check", () => {
    const result = fleshAndBloodServerAdapter.validateDeckForFormat("blitz", [
      { cardId: DASH_YOUNG_CANONICAL, quantity: 1 },
      { cardId: NIMBLISM_RED_CANONICAL, quantity: 40 },
      { cardId: ALPHA_RAMPAGE_CANONICAL, quantity: 5, sectionId: "inventory" },
    ]);
    expect(result.rules).not.toContainEqual(
      expect.objectContaining({ kind: "deck-size", passed: false }),
    );
    expect(result.rules).not.toContainEqual(
      expect.objectContaining({ kind: "deck-too-small", passed: false }),
    );
  });

  it("registers catalog/structured cardDefinitions so lookup resolves pitch and types", () => {
    const cardsMaps = buildCardsMaps();
    const definitions = buildFabEngineCardDefinitions(cardsMaps);
    // Deck stored slugs; definitions keyed under slug + canonical so lookupCard works.
    expect(definitions[ALPHA_RAMPAGE_SLUG]?.base.numeric.power).toBe(9);
    expect(definitions[ALPHA_RAMPAGE_SLUG]?.base.numeric.pitch).toBe(1);
    expect(definitions[ALPHA_RAMPAGE_CANONICAL]?.base.numeric.power).toBe(9);
    expect(definitions[NIMBLISM_BLUE_SLUG]?.base.numeric.pitch).toBe(3);
  });

  it("runs a full create -> dispatch -> serialize -> restore lifecycle", async () => {
    const cardsMaps = buildCardsMaps();
    const engine = await fleshAndBloodServerAdapter.createServerEngine!({
      gameSlug: "flesh-and-blood",
      seed: "lifecycle-seed",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
      cardsMaps,
    });

    expect(engine.hasGameEnded()).toBe(false);
    expect(engine.getActivePlayerId()).toBe(PLAYER_1);

    // Production path: definitions must be present or plays reject as not_playable.
    const resources = engine.getViewerResources?.({ role: "player", actorId: PLAYER_1 }) as {
      cardDefinitions: Record<string, { base: { numeric: { power?: number; pitch?: number } } }>;
    };
    expect(Object.keys(resources.cardDefinitions).length).toBeGreaterThan(0);
    expect(
      resources.cardDefinitions[ALPHA_RAMPAGE_SLUG] ??
        resources.cardDefinitions[ALPHA_RAMPAGE_CANONICAL],
    ).toMatchObject({ base: { numeric: { power: 9, pitch: 1 } } });

    const endTurn = engine.dispatch(
      "end-turn",
      PLAYER_1,
      {},
      {
        gameId: "g1",
        sourceAuthority: "server",
      },
    );
    expect(endTurn.success).toBe(true);
    expect(engine.getActivePlayerId()).toBe(PLAYER_2);
    expect(engine.getStateID()).toBe(1);
    const endTurnLogs = endTurn.engineLogRecords ?? [];
    expect(endTurnLogs).toHaveLength(1);
    expect(endTurnLogs.map((record) => record.timestamp)).toEqual(
      [...endTurnLogs.map((record) => record.timestamp)].sort((left, right) => left - right),
    );
    expect(endTurnLogs.every((record) => record.stateVersion === endTurn.stateID)).toBe(true);
    expect(endTurn.processedCommand).toEqual({ move: "end-turn" });
    expect(playerNarrative(endTurnLogs[0]?.log)).toMatchObject({
      kind: "player-narrative",
      commandId: expect.any(String),
      moveType: "end-turn",
    });
    expect(endTurnLogs[0]?.log).not.toHaveProperty("events");

    const concede = engine.dispatch(
      "concede",
      PLAYER_2,
      {},
      {
        gameId: "g1",
        sourceAuthority: "server",
      },
    );
    expect(concede.success).toBe(true);
    expect(engine.hasGameEnded()).toBe(true);
    expect(engine.getGameEndResult()?.winnerId).toBe(PLAYER_1);

    const snapshot = fleshAndBloodServerAdapter.serializeEngine!(engine, cardsMaps);
    expect(snapshot.gameSlug).toBe("flesh-and-blood");
    expect(snapshot.historyLength).toBe(0);
    expect(snapshot.state).not.toHaveProperty("committedEvents");
    expect(snapshot.state).not.toHaveProperty("log");
    expect(snapshot.state).not.toHaveProperty("cardDefinitions");
    expect(snapshot.state).not.toHaveProperty("compiledRules");
    const persistedObjects = Object.values(
      (snapshot.state as { objects: Record<string, Record<string, unknown>> }).objects,
    );
    expect(persistedObjects.length).toBeGreaterThan(0);
    expect(
      persistedObjects.every(
        (object) =>
          !("visibility" in object) &&
          !("face" in object) &&
          !("counters" in object) &&
          !("markers" in object),
      ),
    ).toBe(true);
    // Platform persistence retains the player-visible replay record; FAB's
    // compact snapshot never embeds its completed execution history.
    expect(endTurnLogs).toHaveLength(1);
    if (!snapshot.state || typeof snapshot.state !== "object") {
      throw new Error("Expected the FAB adapter to serialize an object state.");
    }
    const staleProgramSnapshot = {
      ...snapshot,
      state: {
        ...snapshot.state,
        programFingerprint: "fab-program-v1-stale-hotfix",
      },
    };
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const restored = await fleshAndBloodServerAdapter.restoreEngine!(staleProgramSnapshot, {
      gameSlug: "flesh-and-blood",
      seed: "lifecycle-seed",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
    });
    expect(restored.hasGameEnded()).toBe(true);
    expect(restored.getGameEndResult()?.winnerId).toBe(PLAYER_1);
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining("current card program"),
      expect.objectContaining({
        snapshotProgramFingerprint: "fab-program-v1-stale-hotfix",
      }),
    );
    warning.mockRestore();
  });

  it("projects both turn-1 refills and logs only the drawing seats", () => {
    const match = FabTestEngine.start(
      { hero: ADAPTER_TEST_HERO_1, hand: [ADAPTER_TEST_CARD], deck: 3 },
      { hero: ADAPTER_TEST_HERO_2, hand: [ADAPTER_TEST_CARD], deck: 3 },
    );
    const First = match.as(ADAPTER_TEST_HERO_1);
    const Second = match.as(ADAPTER_TEST_HERO_2);
    const engine = new FleshAndBloodServerEngine(match.getRuntime());

    const result = engine.dispatch(
      "end-turn",
      First.id,
      {},
      {
        gameId: "turn-one-refill",
        sourceAuthority: "server",
      },
    );

    expect(result.success).toBe(true);
    const playerOneView = engine.getViewerState({
      role: "player",
      actorId: First.id,
    }) as FabViewerState;
    const playerTwoView = engine.getViewerState({
      role: "player",
      actorId: Second.id,
    }) as FabViewerState;
    expect(playerOneView.players[First.id]!.zones.hand).toHaveLength(4);
    expect(playerOneView.players[Second.id]!.zones.hand).toHaveLength(4);
    expect(playerTwoView.players[First.id]!.zones.hand).toHaveLength(4);
    expect(playerTwoView.players[Second.id]!.zones.hand).toHaveLength(4);

    // Consecutive same-player draws aggregate into one count line per seat.
    const log = playerNarrative(result.engineLogRecords?.[0]?.log);
    const drawMessages = log.entries
      .flatMap((entry) => (entry.publicMessage ? [entry.publicMessage] : []))
      .filter((message) => message.key === "flesh-and-blood.draw.cards");
    expect(drawMessages.map((message) => message.values)).toEqual([
      { playerId: First.id, count: 3 },
      { playerId: Second.id, count: 3 },
    ]);
    expect(drawMessages.every((message) => message.cardRefs === undefined)).toBe(true);
    expect(drawMessages.every((message) => !("cardNames" in message.values))).toBe(true);
  });

  it("does not emit platform logs for a rejected legacy FAB command", () => {
    const fixture = FabTestEngine.create({
      player1: { hand: [catalogIds.nimblismBlue], deck: 2 },
      player2: { hand: [catalogIds.nimblismBlue], deck: 2 },
    });
    const engine = new FleshAndBloodServerEngine(fixture.getRuntime());

    const result = engine.dispatch(
      "begin-play",
      "player-1",
      { cardId: "legacy-card-id" },
      { gameId: "rejected-command", sourceAuthority: "server" },
    );

    expect(result).toMatchObject({ success: false, errorCode: "invalid_command_payload" });
    expect(result).not.toHaveProperty("engineLogRecords");
  });

  it("forwards one player narrative and the exact typed command from one FAB transition", () => {
    const fixture = FabTestEngine.create({
      player1: { hand: [catalogIds.nimblismBlue], deck: 2 },
      player2: { hand: [catalogIds.nimblismBlue], deck: 2 },
    });
    const engine = new FleshAndBloodServerEngine(fixture.getRuntime());

    const result = engine.dispatch(
      "end-turn",
      "player-1",
      {},
      {
        gameId: "typed-command-receipt",
        sourceAuthority: "server",
      },
    );

    expect(result).toMatchObject({
      success: true,
      processedCommand: { move: "end-turn" },
    });
    if (!result.success) throw new Error(result.error);
    expect(result.engineLogRecords).toHaveLength(1);
    expect(playerNarrative(result.engineLogRecords?.[0]?.log)).toMatchObject({
      commandId: "typed-command-receipt:player-1:1",
      moveType: "end-turn",
      actorId: "player-1",
      entries: expect.any(Array),
    });
    expect(result.engineLogRecords?.[0]?.log).not.toHaveProperty("events");
  });

  it("does not claim a play completed while its private cost decision is pending", () => {
    const fixture = FabTestEngine.create(
      {
        player1: {
          heroCardId: catalogIds.rhinar,
          hand: [catalogIds.wreckerRomp, catalogIds.nimblismBlue],
          deck: 8,
          actionPoints: 1,
        },
        player2: { heroCardId: catalogIds.bravo, hand: [], deck: 8 },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const instanceId = fixture.findCardInZone("player-1", "hand", catalogIds.wreckerRomp);
    const engine = new FleshAndBloodServerEngine(fixture.getRuntime());

    const result = engine.dispatch(
      "begin-play",
      "player-1",
      { instanceId, target: "player-2" },
      { gameId: "private-command-receipt", sourceAuthority: "server" },
    );

    expect(result).toMatchObject({
      success: true,
      processedCommand: { move: "begin-play", instanceId },
    });
    if (!result.success) throw new Error(result.error);
    expect(result.acceptedMoveRecord.processedCommand).toEqual({
      move: "begin-play",
      instanceId,
      target: "player-2",
    });
    expect(result.engineLogRecords).toHaveLength(1);
    expect(playerNarrative(result.engineLogRecords?.[0]?.log)).toMatchObject({
      moveType: "begin-play",
      actorId: "player-1",
      entries: [],
    });
  });

  it("passes the engine's private draw replacements through untouched", () => {
    const match = FabTestEngine.start(
      { hero: ADAPTER_TEST_HERO_1, hand: [ADAPTER_TEST_CARD], deck: namedDeck() },
      { hero: ADAPTER_TEST_HERO_2, hand: [ADAPTER_TEST_CARD], deck: 3 },
    );
    const First = match.as(ADAPTER_TEST_HERO_1);
    const Second = match.as(ADAPTER_TEST_HERO_2);
    const engine = new FleshAndBloodServerEngine(match.getRuntime());

    const result = engine.dispatch(
      "end-turn",
      First.id,
      {},
      { gameId: "canonical-passthrough", sourceAuthority: "server" },
    );

    expect(result.success).toBe(true);
    const log = playerNarrative(result.engineLogRecords?.[0]?.log);
    const firstDraw = log.entries.find(
      (entry) => entry.privateMessageByPlayerId?.[First.id]?.key === "flesh-and-blood.draw.private",
    );
    const secondDraw = log.entries.find(
      (entry) =>
        entry.privateMessageByPlayerId?.[Second.id]?.key === "flesh-and-blood.draw.private",
    );
    expect(firstDraw?.privateMessageByPlayerId?.[First.id]).toMatchObject({
      key: "flesh-and-blood.draw.private",
      values: { playerId: First.id, cardNames: expect.stringContaining(ADAPTER_TEST_CARD.name) },
    });
    expect(secondDraw?.privateMessageByPlayerId?.[Second.id]).toMatchObject({
      key: "flesh-and-blood.draw.private",
      values: { playerId: Second.id, cardNames: expect.any(String) },
    });
    expect(firstDraw?.publicMessage).toMatchObject({
      key: "flesh-and-blood.draw.cards",
      values: { playerId: First.id, count: 3 },
    });
    expect(firstDraw?.publicMessage?.cardRefs).toBeUndefined();
  });

  it("drops private replacements for spectators and selects only the owner's", () => {
    const match = FabTestEngine.start(
      { hero: ADAPTER_TEST_HERO_1, hand: [ADAPTER_TEST_CARD], deck: namedDeck() },
      { hero: ADAPTER_TEST_HERO_2, hand: [ADAPTER_TEST_CARD], deck: 3 },
    );
    const First = match.as(ADAPTER_TEST_HERO_1);
    const Second = match.as(ADAPTER_TEST_HERO_2);
    const engine = new FleshAndBloodServerEngine(match.getRuntime());

    const result = engine.dispatch(
      "end-turn",
      First.id,
      {},
      { gameId: "spectator-drop", sourceAuthority: "server" },
    );

    expect(result.success).toBe(true);
    const canonical = playerNarrative(result.engineLogRecords?.[0]?.log);

    const spectatorView = visiblePlayerNarrative(selectVisibleEngineLogForViewer(canonical, null));
    expect(
      spectatorView.entries.every((entry) => entry.message.key !== "flesh-and-blood.draw.private"),
    ).toBe(true);
    expect(spectatorView.entries.every((entry) => entry.message.cardRefs === undefined)).toBe(true);

    const firstView = visiblePlayerNarrative(selectVisibleEngineLogForViewer(canonical, First.id));
    const secondView = visiblePlayerNarrative(
      selectVisibleEngineLogForViewer(canonical, Second.id),
    );
    const firstPrivate = firstView.entries.filter(
      (entry) => entry.message.key === "flesh-and-blood.draw.private",
    );
    const secondPrivate = secondView.entries.filter(
      (entry) => entry.message.key === "flesh-and-blood.draw.private",
    );
    expect(firstPrivate).toHaveLength(1);
    expect(secondPrivate).toHaveLength(1);
    expect(firstPrivate[0]?.message.values).toMatchObject({ playerId: First.id });
    expect(secondPrivate[0]?.message.values).toMatchObject({ playerId: Second.id });
  });

  it("projects viewer-scoped legal card actions and dispatches through the authoritative runtime", async () => {
    const cardsMaps = fleshAndBloodServerAdapter.buildCardInstances([
      {
        owner: PLAYER_1,
        deck: [
          { cardId: ALPHA_RAMPAGE_SLUG, qty: 1 },
          { cardId: NIMBLISM_BLUE_SLUG, qty: 2 },
        ],
      },
      { owner: PLAYER_2, deck: [{ cardId: NIMBLISM_BLUE_SLUG, qty: 3 }] },
    ]);
    const engine = await fleshAndBloodServerAdapter.createServerEngine!({
      gameSlug: "flesh-and-blood",
      seed: "interaction-projection",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
      cardsMaps,
    });
    const ownView = engine.getInteractionView!(PLAYER_1)!;
    const waitingView = engine.getInteractionView!(PLAYER_2)!;
    const cardAction = ownView.actions.find((action) => action.source?.kind === "card");

    expect(cardAction?.source?.instanceId).toMatch(/^fab-p1-/);
    expect(
      waitingView.actions.every(
        (action) => action.source == null || action.source.instanceId.startsWith("fab-p2-"),
      ),
    ).toBe(true);
    const submission = buildInteractionSubmissionForActionId({
      view: ownView,
      actionId: cardAction!.id,
    });
    expect(submission).not.toBeNull();
    const result = engine.submitInteraction!(PLAYER_1, submission!, {
      gameId: "g-interaction",
      sourceAuthority: "server",
    });
    expect(result.success).toBe(true);
    expect(engine.getStateID()).toBe(1);
  });

  it("projects one-card payment, cancellation, and observer-safe progress", () => {
    const game = FabTestEngine.create({
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
      player1: {
        heroCardId: catalogIds.rhinar,
        hand: [catalogIds.wreckerRomp, catalogIds.nimblismBlue],
        deck: 4,
      },
      player2: { heroCardId: catalogIds.bravo, hand: [], deck: 4 },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    });
    const engine = new FleshAndBloodServerEngine(game.getRuntime());
    const readyView = engine.getInteractionView(PLAYER_1);
    const playAction = readyView.actions.find((action) => /Wrecker Romp/.test(action.text.key));
    expect(playAction).toBeDefined();
    const play = buildInteractionSubmissionForActionId({
      view: readyView,
      actionId: playAction!.id,
    });
    expect(play).not.toBeNull();
    expect(
      engine.submitInteraction(PLAYER_1, play!, {
        gameId: "g-payment",
        sourceAuthority: "server",
      }).success,
    ).toBe(true);

    const paymentView = engine.getInteractionView!(PLAYER_1)!;
    const observerView = engine.getInteractionView!(PLAYER_2)!;
    const paymentAction = paymentView.actions.find((action) => action.intent === "resource-card");
    const cancelAction = paymentView.actions.find((action) => action.intent === "undo");
    expect(paymentView.status).toBe("choosing");
    expect(paymentView.resolution?.currentEffect.text.key).toMatch(
      /Pitch a card to pay 2 remaining resources for Wrecker Romp/,
    );
    expect(paymentAction?.inputs[0]?.kind).toBe("entity-selection");
    expect(paymentAction?.inputs[0]).toMatchObject({ min: 1, max: 1, role: "cost" });
    expect(cancelAction?.intent).toBe("undo");
    expect(observerView.status).toBe("waiting");
    expect(observerView.actions.some((action) => action.intent === "resource-card")).toBe(false);

    if (!paymentAction || paymentAction.inputs[0]?.kind !== "entity-selection") {
      throw new Error("Expected a resource-payment action.");
    }
    const pitchCardId = paymentAction.inputs[0].candidates[0]!.entity.instanceId;
    const payment = buildInteractionSubmission({
      view: paymentView,
      action: paymentAction,
      values: { answer: [pitchCardId] },
    });
    expect(
      engine.submitInteraction!(PLAYER_1, payment, {
        gameId: "g-payment",
        sourceAuthority: "server",
      }).success,
    ).toBe(true);
    expect(engine.getInteractionView!(PLAYER_1)!.resolution).toBeUndefined();
  });

  it("seats capitalized catalog Hero cards outside each player's deck", async () => {
    const cardsMaps = fleshAndBloodServerAdapter.buildCardInstances([
      {
        owner: PLAYER_1,
        deck: [
          { cardId: "dash", qty: 1 },
          { cardId: ALPHA_RAMPAGE_SLUG, qty: 3 },
        ],
      },
      {
        owner: PLAYER_2,
        deck: [
          { cardId: "bravo", qty: 1 },
          { cardId: NIMBLISM_BLUE_SLUG, qty: 3 },
        ],
      },
    ]);
    const engine = await fleshAndBloodServerAdapter.createServerEngine!({
      gameSlug: "flesh-and-blood",
      seed: "seat-heroes",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
      cardsMaps,
    });
    const viewer = engine.getViewerState?.({ role: "player", actorId: PLAYER_1 }) as {
      players: Record<
        string,
        { heroCardId: string | null; life: number; zones: { deck: string[]; hand: string[] } }
      >;
    };

    expect(cardsMaps.cardInstances[viewer.players[PLAYER_1]!.heroCardId!]).toBe("dash");
    expect(cardsMaps.cardInstances[viewer.players[PLAYER_2]!.heroCardId!]).toBe("bravo");
    // CR 2.5.1-2.5.2: starting life comes from the seated hero's printed
    // life. These `dash` and `bravo` slugs resolve to their Young heroes.
    expect(viewer.players[PLAYER_1]).toMatchObject({ life: 20 });
    expect(viewer.players[PLAYER_2]).toMatchObject({ life: 20 });
    expect(viewer.players[PLAYER_1]?.zones.hand).toHaveLength(3);
    expect(viewer.players[PLAYER_2]?.zones.hand).toHaveLength(3);
    expect(viewer.players[PLAYER_1]?.zones.deck).toHaveLength(0);
    expect(viewer.players[PLAYER_2]?.zones.deck).toHaveLength(0);
  });

  it("seats selected equipment and weapons without shuffling surplus arena cards", async () => {
    const cardsMaps = fleshAndBloodServerAdapter.buildCardInstances([
      {
        owner: PLAYER_1,
        deck: [
          { cardId: "dash", qty: 1 },
          { cardId: "ironrot-helm", qty: 1 },
          { cardId: "crown-of-providence", qty: 1 },
          { cardId: "scabskin-leathers", qty: 1 },
          { cardId: "romping-club", qty: 1 },
          { cardId: ALPHA_RAMPAGE_SLUG, qty: 6 },
        ],
      },
      {
        owner: PLAYER_2,
        deck: [
          { cardId: "bravo", qty: 1 },
          { cardId: NIMBLISM_BLUE_SLUG, qty: 6 },
        ],
      },
    ]);
    const engine = await fleshAndBloodServerAdapter.createServerEngine!({
      gameSlug: "flesh-and-blood",
      seed: "seat-equipment",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
      cardsMaps,
    });
    const viewer = engine.getViewerState?.({ role: "player", actorId: PLAYER_1 }) as {
      players: Record<
        string,
        { zones: Record<"head" | "legs" | "weapon1" | "weapon2" | "hand" | "deck", string[]> }
      >;
    };
    const zones = viewer.players[PLAYER_1]!.zones;
    expect(zones.head).toHaveLength(1);
    expect(zones.legs).toHaveLength(1);
    expect(zones.weapon1).toHaveLength(1);
    expect(zones.weapon2).toHaveLength(0);
    expect(zones.hand).toHaveLength(4);
    expect(zones.deck).toHaveLength(2);
    expect(zones.hand).toSatisfy((instanceIds: string[]) =>
      instanceIds.every((instanceId) => cardsMaps.cardInstances[instanceId] === ALPHA_RAMPAGE_SLUG),
    );
    expect(zones.deck).toEqual(["face-down", "face-down"]);
  });

  it("only exposes card resources whose identities are visible to the viewer", async () => {
    const cardsMaps = fleshAndBloodServerAdapter.buildCardInstances([
      {
        owner: PLAYER_1,
        deck: [
          { cardId: "dash", qty: 1 },
          { cardId: "ironrot-helm", qty: 1 },
          { cardId: ALPHA_RAMPAGE_SLUG, qty: 8 },
        ],
      },
      {
        owner: PLAYER_2,
        deck: [
          { cardId: "bravo", qty: 1 },
          { cardId: "crown-of-providence", qty: 1 },
          { cardId: NIMBLISM_BLUE_SLUG, qty: 8 },
        ],
      },
    ]);
    const engine = await fleshAndBloodServerAdapter.createServerEngine!({
      gameSlug: "flesh-and-blood",
      seed: "private-viewer-resources",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
      cardsMaps,
    });
    const self = engine.getViewerState?.({ role: "player", actorId: PLAYER_1 }) as {
      players: Record<string, { zones: { hand: string[]; deck: string[]; head: string[] } }>;
    };
    const opponent = engine.getViewerState?.({ role: "player", actorId: PLAYER_2 }) as {
      players: Record<string, { zones: { hand: string[]; deck: string[]; head: string[] } }>;
    };
    const resources = engine.getViewerResources?.({ role: "player", actorId: PLAYER_1 }) as {
      cardInstances: Record<string, string>;
      cardDefinitions: Record<string, unknown>;
    };

    for (const instanceId of self.players[PLAYER_1]!.zones.hand) {
      expect(resources.cardInstances[instanceId]).toBe(ALPHA_RAMPAGE_SLUG);
    }
    expect(resources.cardInstances[self.players[PLAYER_1]!.zones.head[0]!]).toBe("ironrot-helm");
    expect(resources.cardInstances[opponent.players[PLAYER_2]!.zones.head[0]!]).toBe(
      "crown-of-providence",
    );
    for (const instanceId of [
      ...self.players[PLAYER_1]!.zones.deck,
      ...opponent.players[PLAYER_2]!.zones.hand,
      ...opponent.players[PLAYER_2]!.zones.deck,
    ]) {
      expect(resources.cardInstances).not.toHaveProperty(instanceId);
    }
    expect(resources.cardDefinitions).not.toHaveProperty(NIMBLISM_BLUE_SLUG);
  });

  it("seats an off-hand after a one-handed weapon regardless of pool order", () => {
    const definitions = {
      offhand: toFabCardDefinition({ canonicalId: "offhand", types: ["Equipment", "Quiver"] }),
      oneHanded: toFabCardDefinition({ canonicalId: "one-handed", types: ["Weapon", "1H"] }),
      secondOneHanded: toFabCardDefinition({
        canonicalId: "second-one-handed",
        types: ["Weapon", "1H"],
      }),
      twoHanded: toFabCardDefinition({ canonicalId: "two-handed", types: ["Weapon", "2H"] }),
    };
    const cardInstances = {
      "offhand-instance": "offhand",
      "one-handed-instance": "oneHanded",
      "second-one-handed-instance": "secondOneHanded",
      "two-handed-instance": "twoHanded",
    };

    expect(
      classifyFabStartingCards(
        ["offhand-instance", "one-handed-instance"],
        cardInstances,
        definitions,
      ),
    ).toMatchObject({
      arena: {
        weapon1: ["one-handed-instance"],
        weapon2: ["offhand-instance"],
      },
      inventory: [],
    });
    expect(
      classifyFabStartingCards(
        ["offhand-instance", "two-handed-instance"],
        cardInstances,
        definitions,
      ),
    ).toMatchObject({
      arena: { weapon1: ["two-handed-instance"] },
      inventory: ["offhand-instance"],
    });
    expect(
      classifyFabStartingCards(
        ["one-handed-instance", "second-one-handed-instance"],
        cardInstances,
        definitions,
      ),
    ).toMatchObject({
      arena: {
        weapon1: ["one-handed-instance"],
        weapon2: ["second-one-handed-instance"],
      },
      inventory: [],
    });
    expect(
      classifyFabStartingCards(["offhand-instance"], cardInstances, definitions),
    ).toMatchObject({
      arena: { weapon1: ["offhand-instance"] },
      inventory: [],
    });
  });

  it("extracts cards maps from a snapshot", () => {
    const cardsMaps = buildCardsMaps();
    const extracted = fleshAndBloodServerAdapter.extractCardsMapsFromSnapshot!({
      gameSlug: "flesh-and-blood",
      state: {},
      historyLength: 0,
      cardsMaps,
    });
    expect(extracted.owners[PLAYER_1]).toHaveLength(3);
  });

  it("reconciles the forfeit reason with the terminal log", async () => {
    const engine = await fleshAndBloodServerAdapter.createServerEngine!({
      gameSlug: "flesh-and-blood",
      seed: "forfeit",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
      cardsMaps: buildCardsMaps(),
    });
    const result = engine.forfeit!(PLAYER_1, "disconnected", {
      gameId: "g1",
      sourceAuthority: "server",
    });
    expect(result.success).toBe(true);
    expect(engine.hasGameEnded()).toBe(true);
    expect(engine.getGameEndResult()?.winnerId).toBe(PLAYER_1);
    // The authoritative reason is preserved on the terminal state.
    expect(engine.getGameEndResult()?.reason).toBe("disconnected");
    // Command-local logs retain the public command, never a raw reducer event.
    const logRecord = (result as Extract<typeof result, { success: true }>).engineLogRecords?.[0];
    expect(logRecord?.log).toMatchObject({ moveType: "concede" });
  });

  it("charges the decision holder without awarding time for passing priority", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(2_000_000);
    try {
      const engine = await fleshAndBloodServerAdapter.createServerEngine!({
        gameSlug: "flesh-and-blood",
        seed: "priority-clock",
        player1Id: PLAYER_1,
        player2Id: PLAYER_2,
        cardsMaps: buildCardsMaps(),
        timeControl: getPlayGameConfig("flesh-and-blood").timeControl.matchmaking,
        automation: { [PLAYER_1]: "always-hold", [PLAYER_2]: "always-hold" },
      });
      const active = engine.getActivePlayerId()!;
      now.mockReturnValue(2_010_000);
      const result = engine.dispatch(
        "pass",
        active,
        {},
        { gameId: "priority-clock", sourceAuthority: "server" },
      );
      expect(result.success).toBe(true);
      const clock = readFabClock(engine.getState())!;
      expect(clock.clockState[active]?.reserveMsRemaining).toBe(170_000);
      expect(
        Object.entries(clock.clockState)
          .filter(([, player]) => player.isOnClock)
          .map(([id]) => id),
      ).toEqual([engine.getActivePlayerId()]);
      expect(clock.clockState[engine.getActivePlayerId()!]?.lastUpdatedAtMs).toBe(2_010_000);
    } finally {
      now.mockRestore();
    }
  });

  it("persists decision time through restore without automatically forfeiting a late move", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    try {
      const cardsMaps = buildCardsMaps();
      const engine = await fleshAndBloodServerAdapter.createServerEngine!({
        gameSlug: "flesh-and-blood",
        seed: "timed",
        player1Id: PLAYER_1,
        player2Id: PLAYER_2,
        cardsMaps,
        timeControl: getPlayGameConfig("flesh-and-blood").timeControl.matchmaking,
      });
      const active = engine.getActivePlayerId()!;
      expect(
        readFabClock(engine.getViewerState!({ role: "player", actorId: active }))?.clockState[
          active
        ]?.isOnClock,
      ).toBe(true);
      now.mockReturnValue(1_010_000);
      const snapshot = fleshAndBloodServerAdapter.serializeEngine!(engine, cardsMaps);
      const restored = await fleshAndBloodServerAdapter.restoreEngine!(snapshot, {
        gameSlug: "flesh-and-blood",
        seed: "timed",
        player1Id: PLAYER_1,
        player2Id: PLAYER_2,
      });
      expect(fabRemainingMs(readFabClock(restored.getState())!, active, Date.now())).toBe(170_000);
      now.mockReturnValue(1_195_000);
      const result = restored.dispatch(
        "pass",
        active,
        {},
        { gameId: "timed", sourceAuthority: "server" },
      );
      expect(result.success).toBe(true);
      expect(restored.hasGameEnded()).toBe(false);
      expect(restored.getGameEndResult()).toBeUndefined();
      expect(fabRemainingMs(readFabClock(restored.getState())!, active, Date.now())).toBe(-15_000);
    } finally {
      now.mockRestore();
    }
  });

  it("rejects an unsupported time-control mode", async () => {
    await expect(
      fleshAndBloodServerAdapter.createServerEngine!({
        gameSlug: "flesh-and-blood",
        seed: "clock",
        player1Id: PLAYER_1,
        player2Id: PLAYER_2,
        cardsMaps: buildCardsMaps(),
        timeControl: { mode: "chess", initialReserveMs: 60_000 },
      }),
    ).rejects.toThrow(/time-control mode "chess"/);
  });

  it("registers with the global adapter registry", () => {
    expect(() => registerFleshAndBloodServerAdapter()).not.toThrow();
  });
});
