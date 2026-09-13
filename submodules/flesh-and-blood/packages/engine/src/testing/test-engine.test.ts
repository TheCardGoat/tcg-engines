import { describe, expect, it } from "vite-plus/test";
import {
  FabTestEngine,
  createFabTestState,
  FAB_FACE_DOWN,
  normalizeFabHarnessConfig,
  orderPitchForBottom,
  selectAutoPitchPayment,
  type FabTestFixture,
} from "../index.ts";
import {
  bravo,
  cosmicFlareRed,
  cintariSellsword,
  dawnblade,
  dash,
  nimbleStrikeRed,
  nimblismBlue,
  snatchRed,
} from "../rules/fixtures.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../automation/catalog-test-cards.ts";

const HERO_A = "hero-alpha";
const HERO_B = "hero-bravo";
const ATTACK_A = "attack-alpha";
const BLOCK_A = "block-alpha";

function standardFixture(): FabTestFixture {
  return {
    seed: "harness",
    player1: { heroCardId: HERO_A, life: 18, hand: [ATTACK_A], deck: 4 },
    player2: { heroCardId: HERO_B, life: 16, hand: [BLOCK_A], deck: 4 },
  };
}

describe("FabTestEngine fixtures", () => {
  it("seats heroes, life, and declared zones from the fixture", () => {
    const engine = FabTestEngine.create(standardFixture());
    const state = engine.getState();

    expect(state.playerIds).toEqual(["player-1", "player-2"]);
    expect(state.playerIds).toHaveLength(2);
    expect(state.activePlayerId).toBe("player-1");
    expect(state.objects[state.players["player-1"].heroCardId!]?.canonicalId).toBe(HERO_A);
    expect(state.players["player-1"].life).toBe(18);
    expect(state.players["player-2"].life).toBe(16);
    expect(engine.findCardInZone("player-1", "hand", ATTACK_A)).toBeTruthy();
    expect(engine.findCardInZone("player-2", "hand", BLOCK_A)).toBeTruthy();
  });

  it("seats declared starting chi", () => {
    const engine = FabTestEngine.create({
      player1: { heroCardId: HERO_A, chiPoints: 3, deck: 4 },
      player2: { heroCardId: HERO_B, deck: 4 },
    });

    expect(engine.getState().players["player-1"]!.chiPoints).toBe(3);
  });

  it("rejects duplicate seat ids (1v1 product scope)", () => {
    expect(() =>
      createFabTestState({
        player1Id: "same",
        player2Id: "same",
        player1: { heroCardId: HERO_A, deck: 2 },
        player2: { heroCardId: HERO_B, deck: 2 },
      }),
    ).toThrow(/two distinct seats/);
  });

  it("rejects a first player who is not seated", () => {
    expect(() =>
      createFabTestState({
        player1Id: "player-1",
        player2Id: "player-2",
        firstPlayerId: "spectator",
        player1: { heroCardId: HERO_A, deck: 2 },
        player2: { heroCardId: HERO_B, deck: 2 },
      }),
    ).toThrow(/firstPlayerId must identify a seated player/);
  });

  it("keeps leftover fixture cards in the deck so draws stay legal", () => {
    const engine = FabTestEngine.create(standardFixture());
    expect(engine.getState().containers.zonesByPlayerId["player-1"]!.deck).toHaveLength(4);
  });

  it("expands numeric zones into filler cards", () => {
    const engine = FabTestEngine.create({
      player1: { hand: 3 },
      player2: { hand: 2 },
    });
    expect(engine.getState().containers.zonesByPlayerId["player-1"]!.hand).toHaveLength(3);
    expect(engine.getState().containers.zonesByPlayerId["player-2"]!.hand).toHaveLength(2);
  });

  it("applies declared per-instance state while seating fixture cards", () => {
    const engine = FabTestEngine.create({
      player1: { head: [{ card: nimblismBlue, state: { faceDown: true } }], deck: 4 },
      player2: { deck: 4 },
    });
    const id = engine.findCardInZone("player-1", "head", nimblismBlue);

    expect(engine.objectState(id).faceDown).toBe(true);
  });

  it("reads an arena object's evaluated life through the public test-engine API", () => {
    const engine = FabTestEngine.start(
      { hero: bravo, arena: [cintariSellsword], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const ally = engine.as(bravo).findCardInZone("arena", cintariSellsword);

    expect(engine.objectLife(ally)).toBe(2);
    expect(engine.objectLife("missing-object")).toBeUndefined();
  });

  it("applies declared hero state while seating the fixture", () => {
    const engine = FabTestEngine.create({
      player1: { heroCardId: HERO_A, heroState: { tapped: true }, deck: 4 },
      player2: { heroCardId: HERO_B, deck: 4 },
    });

    expect(engine.objectState(engine.getState().players["player-1"].heroCardId!).tapped).toBe(true);
  });

  it("draws an opening hand only when the fixture does not declare one", () => {
    const engine = FabTestEngine.create({
      player1: { deck: 6 },
      player2: { hand: [], deck: 6 },
    });

    expect(engine.getState().containers.zonesByPlayerId["player-1"]!.hand).toHaveLength(4);
    expect(engine.getState().containers.zonesByPlayerId["player-1"]!.deck).toHaveLength(2);
    expect(engine.getState().containers.zonesByPlayerId["player-2"]!.hand).toHaveLength(0);
    expect(engine.getState().containers.zonesByPlayerId["player-2"]!.deck).toHaveLength(6);
  });

  it("is deterministic across engines built from the same fixture", () => {
    const a = createFabTestState(standardFixture());
    const b = createFabTestState(standardFixture());
    expect(a.containers.zonesByPlayerId["player-1"]!.deck).toEqual(
      b.containers.zonesByPlayerId["player-1"]!.deck,
    );
  });
});

describe("FabTestEngine dispatch", () => {
  it("keeps explicit decision answers on the player-facing test surface", () => {
    const engine = FabTestEngine.create(standardFixture());
    const player = engine.as(HERO_A);

    expect(() => player.expectDecision("boolean")).toThrow(/pending boolean decision/);
    expect(() => player.chooseBoolean(true)).toThrow(/pending boolean decision/);
  });

  it("passes the turn through the typed helper and bumps stateID", () => {
    const engine = FabTestEngine.create(standardFixture());
    engine.endTurn("player-1");
    expect(engine.getActivePlayerId()).toBe("player-2");
    expect(engine.getState().turnNumber).toBe(2);
    expect(engine.getStateID()).toBe(1);
    expect(engine.getState()).not.toHaveProperty("committedEvents");
    expect(engine.getState()).not.toHaveProperty("log");
  });

  it("throws a FabMoveFailedError when the non-active player ends the turn", () => {
    const engine = FabTestEngine.create(standardFixture());
    expect(() => engine.endTurn("player-2")).toThrow();
    // Held state is untouched.
    expect(engine.getActivePlayerId()).toBe("player-1");
    expect(engine.getStateID()).toBe(0);
  });

  it("ends the match on concede with the opponent as winner", () => {
    const engine = FabTestEngine.create(standardFixture());
    engine.concede("player-1");
    expect(engine.hasGameEnded()).toBe(true);
    expect(engine.getGameEndResult().winnerId).toBe("player-2");
  });

  it("returns the rejection via expectFailure without mutating state", () => {
    const engine = FabTestEngine.create(standardFixture());
    const rejection = engine.expectFailure({ move: "end-turn", actorId: "player-2" });
    expect(rejection.accepted).toBe(false);
    expect(rejection.errorCode).toBe("not_active_player");
    expect(engine.getActivePlayerId()).toBe("player-1");
    expect(engine.getStateID()).toBe(0);
  });

  it("does not translate legacy command aliases at the test-driver boundary", () => {
    const engine = FabTestEngine.create(standardFixture());
    const rejection = engine.expectFailure({
      move: "begin-play",
      actorId: "player-1",
      payload: { cardId: "legacy-card-id" },
    });
    expect(rejection.errorCode).toBe("invalid_command_payload");
    expect(engine.getStateID()).toBe(0);
    expect(rejection).not.toHaveProperty("playerLogs");
  });

  it("rejects unknown moves and unknown actors", () => {
    const engine = FabTestEngine.create(standardFixture());
    expect(engine.expectFailure({ move: "fly-away", actorId: "player-1" }).errorCode).toBe(
      "unknown_move",
    );
    expect(engine.expectFailure({ move: "end-turn", actorId: "nobody" }).errorCode).toBe(
      "unknown_actor",
    );
  });

  it("throws when expectFailure receives a move that is actually accepted", () => {
    const engine = FabTestEngine.create(standardFixture());
    expect(() => engine.expectFailure({ move: "end-turn", actorId: "player-1" })).toThrow(
      /to fail, but it was accepted/,
    );
  });
});

describe("FabTestEngine projection", () => {
  it("hides an opponent's hand and deck order but keeps public zones", () => {
    const engine = FabTestEngine.create({
      seed: "view",
      player1: { hand: [ATTACK_A] },
      player2: {
        hand: [BLOCK_A],
        graveyard: [ATTACK_A],
        pitch: [BLOCK_A],
        deck: 2,
      },
    });

    const view = engine.getView({ role: "player", actorId: "player-1" });
    expect(view.players["player-2"]!.zones.hand.every((id) => id === FAB_FACE_DOWN)).toBe(true);
    expect(view.players["player-2"]!.zones.deck.every((id) => id === FAB_FACE_DOWN)).toBe(true);
    expect(view.players["player-1"]!.zones.hand).toContain(
      engine.findCardInZone("player-1", "hand", ATTACK_A),
    );
  });
});

describe("FabTestEngine.start — hero-keyed ergonomic API", () => {
  // Hero card objects stand in for generated hero modules; `health` drives the
  // default starting life so tests rarely set `life` explicitly.
  const bravo = { canonicalId: HERO_A, health: 20 } as const;
  const dash = { canonicalId: HERO_B, health: 18 } as const;

  it("seats players by imported hero card and defaults life to printed health", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [ATTACK_A] },
      { hero: dash, hand: [BLOCK_A] },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expect(Bravo.life()).toBe(20);
    expect(Dash.life()).toBe(18);
    expect(Bravo.isActive()).toBe(true);
    expect(Dash.isActive()).toBe(false);
    expect(game.activeHero()).toBe(HERO_A);
  });

  it("reads a player through its handle without repeating the actor", () => {
    const game = FabTestEngine.start({ hero: bravo, hand: [ATTACK_A] }, { hero: dash });
    expect(game.as(bravo).hand()).toContain(ATTACK_A);
    expect(game.as(bravo).handCount()).toBe(1);
  });

  it("drives turns from the active player handle", () => {
    const game = FabTestEngine.start({ hero: bravo }, { hero: dash });
    expect(game.turn()).toBe(1);

    game.active().endTurn();
    expect(game.turn()).toBe(2);
    expect(game.activeHero()).toBe(HERO_B);
  });

  it("keeps endTurn/concede on the handle and throws on rejection", () => {
    const game = FabTestEngine.start({ hero: bravo }, { hero: dash });
    expect(() => game.as(dash).endTurn()).toThrow(); // non-active cannot end turn
    expect(game.as(bravo).isActive()).toBe(true); // untouched

    game.as(dash).concede();
    expect(game.hasGameEnded()).toBe(true);
    expect(game.getGameEndResult().winnerId).toBeDefined();
  });

  it("honors an explicit first-player hero and per-player life override", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: 12 },
      { hero: dash },
      { firstPlayer: dash },
    );
    expect(game.as(bravo).life()).toBe(12);
    expect(game.activeHero()).toBe(HERO_B);
  });

  it("disambiguates a mirror matchup by seat", () => {
    const game = FabTestEngine.start({ hero: bravo }, { hero: bravo });
    expect(() => game.as(bravo)).toThrow(/mirror match/);
    expect(game.as(bravo, 1).isActive()).toBe(true);
    expect(game.as(bravo, 2).isActive()).toBe(false);
  });

  it("throws when addressing a hero that is not seated", () => {
    const game = FabTestEngine.start({ hero: bravo }, { hero: dash });
    expect(() => game.as("absent-hero")).toThrow(/No player is seated/);
  });

  it("rejects a non-weapon card in a weapon slot", () => {
    expect(() =>
      FabTestEngine.start({ hero: bravo, weapon1: [snatchRed] }, { hero: dash }),
    ).toThrow(/non-weapon-in-slot/);
  });

  it("rejects more than two cards across the weapon area", () => {
    expect(() =>
      FabTestEngine.start(
        { hero: bravo, weapon1: [dawnblade, dawnblade], weapon2: [dawnblade] },
        { hero: dash },
      ),
    ).toThrow(/too-many-weapons/);
  });

  it("rejects two weapons seated in the same weapon slot", () => {
    expect(() =>
      FabTestEngine.start({ hero: bravo, weapon1: [dawnblade, dawnblade] }, { hero: dash }),
    ).toThrow(/overfull-weapon-slot/);
  });
});

// ---------------------------------------------------------------------------
// Shared ergonomic examples — these mirror the player-readable shape shown in
// the PR discussion. The card-like objects below stand in for generated
// `@tcg/fab-cards` modules; the harness reads only `canonicalId`/`health`, so
// real imported cards work identically. Action verbs (pitch / play /
// attackWith / blockWith) join the handle as those engine moves land; until
// then the surface is endTurn / concede plus the raw `exec` escape hatch.
// ---------------------------------------------------------------------------
const bravoShowstopper = { canonicalId: "bravo-showstopper", health: 20 } as const;
const dashInventor = { canonicalId: "dash-inventor", health: 18 } as const;
const spinalAssault = { canonicalId: "spinal-assault" } as const;
const sinkBelow = { canonicalId: "sink-below" } as const;

describe("FabTestEngine — shared ergonomic examples", () => {
  it("reads like a match: seat by hero, address by hero, read state", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [spinalAssault], deck: 40 }, // life defaults to printed health (20)
      { hero: dashInventor, hand: [sinkBelow], deck: 40 },
    );

    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dashInventor);

    expect(Bravo.life()).toBe(20);
    expect(Dash.life()).toBe(18);
    expect(Bravo.hand()).toContain("spinal-assault");
    expect(Dash.hand()).toContain("sink-below");
  });

  it("drives the active player without naming them", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, deck: 40 },
      { hero: dashInventor, deck: 40 },
    );
    // whoever currently has priority:
    game.active().endTurn();
    expect(game.turn()).toBe(2);
    expect(game.activeHero()).toBe("dash-inventor");
  });

  it("rejects play of a card that is not an attack action via expectFailure", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [spinalAssault] },
      { hero: dashInventor },
    );
    // Filler-shaped cards have no registered attack types — play is rejected.
    const cardId = game.findCardInZone(game.as(bravoShowstopper).id, "hand", spinalAssault);
    const rejection = game.as(bravoShowstopper).expectFailure({
      move: "begin-play",
      payload: { instanceId: cardId, target: game.as(dashInventor).id },
    });
    expect(rejection.accepted).toBe(false);
    expect(rejection.errorCode).toBe("unsupported_play_type");
    expect(game.as(bravoShowstopper).handCount()).toBe(1);
  });
});

describe("FabTestEngine harness config", () => {
  it("defaults smart assists ON: autoPitch, autoPassPriority, pitchStack as-pitched", () => {
    const game = FabTestEngine.start({ hero: bravo }, { hero: dash });
    expect(game.getConfig()).toEqual({
      autoPitch: true,
      autoPassPriority: true,
      pitchStack: "as-pitched",
    });
    expect(normalizeFabHarnessConfig(undefined).autoPitch).toBe(true);
    expect(normalizeFabHarnessConfig(undefined).autoPassPriority).toBe(true);
    expect(normalizeFabHarnessConfig(undefined).pitchStack).toBe("as-pitched");
  });

  it("explicit opts-out win over the smart defaults", () => {
    expect(
      normalizeFabHarnessConfig({
        autoPitch: false,
        autoPassPriority: false,
        pitchStack: "manual",
      }),
    ).toEqual({ autoPitch: false, autoPassPriority: false, pitchStack: "manual" });
    // Partial config inherits the smart defaults for the omitted fields.
    expect(normalizeFabHarnessConfig({ pitchStack: "high-first" })).toEqual({
      autoPitch: true,
      autoPassPriority: true,
      pitchStack: "high-first",
    });
  });

  it("autoPitch covers resource cost when play omits pitch", () => {
    const game = FabTestEngine.start(
      // resourcePoints: 0 starts with no resources so the auto-pitch
      // shortfall path stays under test.
      { hero: bravo, hand: [nimbleStrikeRed, nimblismBlue], deck: 6, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      // autoPassPriority off: the attack must stay on the stack for assertion.
      { autoPitch: true, autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    // cost 1, no RP — autoPitch selects nimblismBlue (pitch 3)
    Bravo.play(nimbleStrikeRed);
    expect(Bravo.zone("pitch")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.resourcePoints()).toBe(2); // 3 − 1
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
  });

  it("explicit pitch still wins over autoPitch", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, nimblismBlue], deck: 6, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPitch: true },
    );
    game.as(bravo).play(nimbleStrikeRed, { pitch: [nimblismBlue] });
    expect(game.as(bravo).zone("pitch")).toContain(nimblismBlue.canonicalId);
  });

  it("autoPassPriority pauses for an explicit no-blockers declaration", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      { autoPassPriority: true },
    );
    game.as(bravo).play(snatchRed);
    // CR 7.3 defense declaration has no priority holder; the defender must
    // explicitly submit the zero-card declaration through pass/defend([]).
    expect(game.combat()?.step).toBe("defend");
    expect(game.combat()?.defenseDeclarationPending).toBe(true);
    expect(game.getState().priority).toBeNull();
  });

  it("autoPassPriority stops when the defender has a legal block", () => {
    // snatch is an attack action with defense value on many hand cards; use a
    // card with printed defense in the defender's hand so defend is legal.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimbleStrikeRed], deck: 6 },
      { autoPassPriority: true },
    );
    game.as(bravo).play(snatchRed);
    // Should stop at defend (nimble strike can block) rather than resolving damage.
    expect(game.combat()?.step).toBe("defend");
    expect(game.getState().priority).toBeNull();
    expect(game.combat()?.defenseDeclarationPending).toBe(true);
  });

  it("autoPassPriority stops when an instant is a legal response", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, cosmicFlareRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: true },
    );

    game.as(bravo).play(snatchRed);

    expect(game.getState().rulesStack).toHaveLength(1);
    expect(game.getPriorityPlayerId()).toBe(game.as(bravo).id);
  });

  it("pitchStack as-pitched injects CR 4.4.3c order on endTurn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        pitch: [nimblismBlue, snatchRed],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { pitchStack: "as-pitched" },
    );
    // Without pitchStack, multi-card pitch requires explicit order and rejects.
    game.as(bravo).endTurn();
    expect(game.getActivePlayerId()).toBe(game.as(dash).id);
    // Pitch zone cleared to bottom of deck.
    expect(game.as(bravo).zone("pitch")).toHaveLength(0);
  });

  it("configure() patches assists mid-test", () => {
    const game = FabTestEngine.start({ hero: bravo, hand: [snatchRed], deck: 4 }, { hero: dash });
    // Smart default is ON; patch can flip a single assist OFF mid-test.
    expect(game.getConfig().autoPassPriority).toBe(true);
    game.configure({ autoPassPriority: false });
    expect(game.getConfig().autoPassPriority).toBe(false);
    expect(game.getConfig().autoPitch).toBe(true);
  });

  it("selectAutoPitchPayment / orderPitchForBottom pure helpers", () => {
    const values: Record<string, number> = { a: 1, b: 3, c: 2 };
    expect(selectAutoPitchPayment(["a", "b", "c"], 3, (id) => values[id]!)).toEqual(["b"]);
    expect(orderPitchForBottom("high-first", ["a", "b", "c"], (id) => values[id]!)).toEqual([
      "b",
      "c",
      "a",
    ]);
  });
});

describe("FabTestEngine floating resource default", () => {
  it("defaults RP to the sum of hand-card costs when omitted", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, nimblismBlue], deck: 6 },
      { hero: dash, deck: 6 },
    );
    // nimbleStrikeRed costs 1, nimblismBlue costs 0 → floating RP 1.
    expect(game.as(bravo).resourcePoints()).toBe(1);
    // Omitted hand seats DEFAULT_HAND but keeps the RP playability floor of 3.
    expect(game.as(dash).resourcePoints()).toBe(3);
  });

  it("explicit resourcePoints (including 0) always wins", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed], deck: 6, resourcePoints: 0 },
      { hero: dash, resourcePoints: 5 },
    );
    expect(game.as(bravo).resourcePoints()).toBe(0);
    expect(game.as(dash).resourcePoints()).toBe(5);
  });

  it("floating RP does not accumulate across turns", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed], deck: 6 },
      { hero: dash, deck: 6 },
    );
    expect(game.as(bravo).resourcePoints()).toBe(1);
    expect(game.as(dash).resourcePoints()).toBe(3);

    // The end-turn asset reset clears floating RP for both players, so the
    // default never compounds into the next turn.
    game.endTurn("player-1");
    expect(game.turn()).toBe(2);
    expect(game.as(bravo).resourcePoints()).toBe(0);
    expect(game.as(dash).resourcePoints()).toBe(0);
  });
});

describe("FabPlayerHandle.card — strict zone-less resolver", () => {
  it("resolves a unique card across all zones", () => {
    // Arrange
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], graveyard: [nimblismBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act / Assert — hand and graveyard are both searched.
    expect(Bravo.card(snatchRed)).toBeTruthy();
    expect(Bravo.card(nimblismBlue)).toBeTruthy();
  });

  it("throws naming the card and searched zones when absent", () => {
    const game = FabTestEngine.start({ hero: bravo, hand: [snatchRed] }, { hero: dash });
    expect(() => game.as(bravo).card(nimblismBlue)).toThrow(/Could not find/);
    expect(() => game.as(bravo).card(nimblismBlue)).toThrow(new RegExp(nimblismBlue.canonicalId));
    expect(() => game.as(bravo).card(nimblismBlue)).toThrow(/searched deck, hand/);
  });

  it("throws when multiple copies are present and no index is given", () => {
    // Arrange
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed, nimblismBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );

    // Act / Assert
    expect(() => game.as(bravo).card(snatchRed)).toThrow(/2 copies present, pass an index/);
    expect(game.as(bravo).card(nimblismBlue)).toBeTruthy(); // single copy still resolves
  });

  it("selects the index-th copy deterministically and bounds-checks", () => {
    // Arrange
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act
    const first = Bravo.card(snatchRed, 0);
    const second = Bravo.card(snatchRed, 1);

    // Assert — distinct instances, zone-array order, bounds enforced.
    expect(first).not.toBe(second);
    expect(Bravo.zone("hand")).toHaveLength(2);
    expect(() => Bravo.card(snatchRed, 2)).toThrow(/index 2 out of range/);
    expect(() => Bravo.card(snatchRed, -1)).toThrow(/out of range/);
  });
});

describe("FabPlayerHandle fluent combat verbs", () => {
  it("attackWith reaches the Defend step with the default target", () => {
    // Arrange — opt out of auto-pass: attackWith drives to Defend manually.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    // Act
    game.as(bravo).attackWith(snatchRed);

    // Assert
    game.helpers.expectStep("defend");
    expect(game.combat()?.activeLink?.attackingPlayerId).toBe(game.as(bravo).id);
  });

  it("attackWith honors an explicit target handle", () => {
    // Arrange — opt out of auto-pass: attackWith drives to Defend manually.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    // Act
    game.as(bravo).attackWith(snatchRed, { target: game.as(dash) });

    // Assert
    game.helpers.expectStep("defend");
    expect(game.combat()?.activeLink?.defendingPlayerId).toBe(game.as(dash).id);
  });

  it("defendWith declares blocks and closes combat", () => {
    // Arrange — opt out of auto-pass: attackWith drives to Defend manually.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimbleStrikeRed], deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.expectStep("defend");

    // Act
    const result = game.as(dash).defendWith(nimbleStrikeRed);

    // Assert — the block was declared on the active chain link.
    expect(result.accepted).toBe(true);
    expect(
      Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat(),
    ).toHaveLength(1);

    // Combat closes after the remaining passes.
    game.helpers.resolveRestOfCombat();
    expect(game.combat()?.open).toBeFalsy();
    expect(game.as(dash).zone("graveyard")).toContain(nimbleStrikeRed.canonicalId);
  });

  it("expectBlockRejected probes a rejection without mutating state", () => {
    // Arrange — no combat is open, so a defend declaration must be rejected.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimbleStrikeRed], deck: 6 },
    );

    // Act
    const rejection = game.as(dash).expectBlockRejected(nimbleStrikeRed);

    // Assert
    expect(rejection.accepted).toBe(false);
    expect(rejection.errorCode).toBeTruthy();
    expect(game.getStateID()).toBe(0); // probe never mutates held state
  });
});

describe("FabTestEngine.helpers namespace", () => {
  it("resolveRestOfCombat closes combat after unblocked damage", () => {
    // Arrange — opt out of auto-pass so attackWith stops at the Defend step.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const dashLife = game.as(dash).life();
    game.as(bravo).attackWith(snatchRed);
    game.helpers.expectStep("defend");

    // Act
    game.helpers.resolveRestOfCombat();

    // Assert
    expect(game.combat()?.open).toBeFalsy();
    expect(game.as(dash).life()).toBeLessThan(dashLife);
  });

  it("logHas matches engine log entries by substring", () => {
    // Arrange — opt out of auto-pass so attackWith stops at the Defend step.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    // Act
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Assert — unblocked combat journals the merged hit line.
    expect(game.helpers.logHas("hit")).toBe(true);
    expect(game.helpers.logHas(/hit .+ for \d+/)).toBe(true);
    expect(game.helpers.logHas("no-such-entry-xyz")).toBe(false);
  });

  it("expectLog matches public move-log messages by key and value subset", () => {
    // Arrange — opt out of auto-pass so attackWith stops at the Defend step.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;

    // Act
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Assert — the unblocked chain link resolves as a public hit line.
    game.helpers.expectLog("flesh-and-blood.combat.hit", { targetName: dashId });
    // A wrong value subset must fail, not silently pass.
    expect(() =>
      game.helpers.expectLog("flesh-and-blood.combat.hit", { targetName: bravoId }),
    ).toThrow(/combat\.hit/);
    expect(() => game.helpers.expectLog("flesh-and-blood.search")).toThrow(
      /flesh-and-blood\.search/,
    );
  });

  it("expectPrivateLog asserts the owner-only appendix of a decision log", () => {
    // Arrange — wrecker romp needs a pitch payment, so begin-play parks on a
    // decision receipt: public awaiting line plus private detail for the actor.
    const actorId = "player-1";
    const game = FabTestEngine.create(
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
    const instanceId = game.findCardInZone(actorId, "hand", catalogIds.wreckerRomp);

    // Act
    game.exec({
      move: "begin-play",
      actorId,
      payload: { instanceId, target: "player-2" },
    });

    // Assert
    game.helpers.expectLog("flesh-and-blood.decision.awaiting");
    game.helpers.expectPrivateLog("flesh-and-blood.decision.private", actorId);
    // Claiming the opponent saw the appendix must fail — it is owner-only.
    expect(() =>
      game.helpers.expectPrivateLog("flesh-and-blood.decision.private", "player-2"),
    ).toThrow(/player-2/);
  });
});
