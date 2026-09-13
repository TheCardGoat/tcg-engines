import { describe, expect, it } from "vitest";
import { registerFabCardDefinition } from "./cards.ts";
import { fabObjectInstanceId, fabPlayerId } from "./game/identity.ts";
import {
  FAB_FACE_DOWN,
  FabMatchRuntime,
  FabTestEngine,
  applyFabCommand,
  projectFabViewerState,
  type FabCardsMaps,
} from "./index.ts";
import { projectFabViewerResources } from "./view.ts";
import {
  CATALOG_TEST_DEFINITIONS,
  catalogIds,
  catalogTestCards,
} from "./automation/catalog-test-cards.ts";
import { expectFabCard, expectFabPlayer, expectWait } from "./testing/fluent-assert.ts";

const PLAYER_A = "player-a";
const PLAYER_B = "player-b";

function cardsMaps(): FabCardsMaps {
  const canonicalIdsByInstance: Record<string, string> = {};
  const owners: Record<string, string[]> = { [PLAYER_A]: [], [PLAYER_B]: [] };
  let ordinal = 0;
  for (const owner of [PLAYER_A, PLAYER_B]) {
    for (let i = 0; i < 10; i++) {
      const instanceId = `${owner}-card-${ordinal++}`;
      canonicalIdsByInstance[instanceId] = `card-${i}`;
      owners[owner].push(instanceId);
    }
  }
  return { canonicalIdsByInstance, owners };
}

function cardDefinitions() {
  const definitions: Record<string, ReturnType<typeof registerFabCardDefinition>> = {};
  for (let index = 0; index < 10; index += 1) {
    definitions[`card-${index}`] = registerFabCardDefinition({
      canonicalId: `card-${index}`,
      name: `Test Card ${index}`,
      types: ["Action"],
    });
  }
  return definitions;
}

describe("FabMatchRuntime", () => {
  it("defensively owns snapshots received through the public runtime boundary", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "runtime-ownership",
      player1Id: PLAYER_A,
      player2Id: PLAYER_B,
      cardsMaps: cardsMaps(),
      cardDefinitions: cardDefinitions(),
    });
    const runtime = new FabMatchRuntime(state);
    const runtimeLife = runtime.getState().players[PLAYER_A].life;

    state.players[PLAYER_A].life = 1;

    expect(runtime.getState().players[PLAYER_A].life).toBe(runtimeLife);
  });

  it("seats both players, draws opening hands, and gives the first player priority", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "test-seed",
      player1Id: PLAYER_A,
      player2Id: PLAYER_B,
      cardsMaps: cardsMaps(),
      cardDefinitions: cardDefinitions(),
    });
    expect(state.playerIds).toEqual([PLAYER_A, PLAYER_B]);
    expect(state.activePlayerId).toBe(PLAYER_A);
    expect(state.turnNumber).toBe(1);
    expect(state.containers.zonesByPlayerId[PLAYER_A]!.hand).toHaveLength(4);
    expect(state.containers.zonesByPlayerId[PLAYER_B]!.hand).toHaveLength(4);
    expect(state.containers.zonesByPlayerId[PLAYER_A]!.deck).toHaveLength(6);
    expect(state.containers.zonesByPlayerId[PLAYER_B]!.deck).toHaveLength(6);
    expect(state.priority).toMatchObject({
      kind: "action",
      holderPlayerId: PLAYER_A,
      combatStep: null,
    });
    expect(state.players[PLAYER_A].actionPoints).toBe(1);
    expect(state.players[PLAYER_B].actionPoints).toBe(0);
    expect(state.gameEnded).toBe(false);
  });

  it("runs turn 1's Start Phase before opening action priority", () => {
    const firstHero = "first-hero";
    const secondHero = "second-hero";
    const tunic = "first-tunic";
    const firstDeck = Array.from({ length: 4 }, (_, index) => `first-deck-${index}`);
    const secondDeck = Array.from({ length: 4 }, (_, index) => `second-deck-${index}`);
    const canonicalIdsByInstance = {
      [firstHero]: catalogIds.bravo,
      [secondHero]: catalogIds.rhinar,
      [tunic]: catalogIds.fyendalTunic,
      ...Object.fromEntries(firstDeck.map((id) => [id, catalogIds.snatch])),
      ...Object.fromEntries(secondDeck.map((id) => [id, catalogIds.snatch])),
    };
    const state = FabTestEngine.createStateForRulesTest({
      seed: "initial-start-phase",
      player1Id: PLAYER_A,
      player2Id: PLAYER_B,
      cardsMaps: {
        canonicalIdsByInstance,
        owners: {
          [PLAYER_A]: [firstHero, tunic, ...firstDeck],
          [PLAYER_B]: [secondHero, ...secondDeck],
        },
      },
      heroes: { [PLAYER_A]: catalogIds.bravo, [PLAYER_B]: catalogIds.rhinar },
      deckInstanceIds: { [PLAYER_A]: firstDeck, [PLAYER_B]: secondDeck },
      startingArena: { [PLAYER_A]: { chest: [tunic] } },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
      skipInitialStartPhase: false,
    });
    const game = FabTestEngine.fromState(state);
    const Bravo = game.as(catalogTestCards.bravo);

    game.untilIdle({ optionals: "accept" });

    expectFabCard(Bravo, catalogTestCards.fyendalTunic).toHaveCounters(1, "energy");
    expectFabPlayer(Bravo).toHaveAP(1);
    expectWait(game).toBeIdle();
  });

  it("shuffles deterministically from the seed", () => {
    const input = {
      seed: "deterministic",
      player1Id: PLAYER_A,
      player2Id: PLAYER_B,
      cardsMaps: cardsMaps(),
      cardDefinitions: cardDefinitions(),
    };
    const a = FabTestEngine.createStateForRulesTest(input);
    const b = FabTestEngine.createStateForRulesTest(input);
    expect(a.containers.zonesByPlayerId[PLAYER_A]!.deck).toEqual(
      b.containers.zonesByPlayerId[PLAYER_A]!.deck,
    );
  });

  it("passes the turn to the opponent on end-turn and bumps stateID", () => {
    const runtime = new FabMatchRuntime(
      FabTestEngine.createStateForRulesTest({
        seed: "turn-flow",
        player1Id: PLAYER_A,
        player2Id: PLAYER_B,
        cardsMaps: cardsMaps(),
        cardDefinitions: cardDefinitions(),
      }),
    );
    const result = runtime.applyCommand(PLAYER_A, { move: "end-turn" });
    expect(result.success).toBe(true);
    expect(runtime.getActivePlayerId()).toBe(PLAYER_B);
    expect(runtime.getStateID()).toBeGreaterThan(0);
    expect(runtime.getState().turnNumber).toBe(2);
    // CR 4.3.2: new turn player receives 1 action point.
    expect(runtime.getState().players[PLAYER_B].actionPoints).toBe(1);
  });

  it("emits a transient command receipt for an ordinary priority pass", () => {
    const runtime = new FabMatchRuntime(
      FabTestEngine.createStateForRulesTest({
        seed: "quiet-pass",
        player1Id: PLAYER_A,
        player2Id: PLAYER_B,
        cardsMaps: cardsMaps(),
        cardDefinitions: cardDefinitions(),
      }),
    );
    const result = runtime.applyCommand(PLAYER_A, { move: "pass" });
    expect(result.success).toBe(true);
    if (!result.success) throw new Error(result.error);
    expect(result.moveLogs).toEqual([
      expect.objectContaining({
        playerId: PLAYER_A,
        moveType: "pass",
        public: [
          expect.objectContaining({
            key: "flesh-and-blood.command.pass",
            values: { actorId: PLAYER_A },
          }),
        ],
      }),
    ]);
  });

  it("returns a readonly, semantic command receipt without exposing event names", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "typed-transition",
      player1Id: PLAYER_A,
      player2Id: PLAYER_B,
      cardsMaps: cardsMaps(),
      cardDefinitions: cardDefinitions(),
    });
    const before = structuredClone(state);

    const result = applyFabCommand(state, {
      actorId: PLAYER_A,
      command: { move: "end-turn" },
    });

    expect(result).toMatchObject({ success: true, status: "settled", stateID: 1 });
    if (!result.success) throw new Error(result.error);
    expect(state).toEqual(before);
    expect(result.state).not.toBe(state);
    expect(result.processedCommand).toEqual({ move: "end-turn" });
    expect(result.moveLogs).toHaveLength(2);
    expect(result.moveLogs.flatMap((log) => log.public.map((message) => message.key))).toEqual([
      "flesh-and-blood.command.end-turn",
      "flesh-and-blood.turn.started",
      "flesh-and-blood.phase.start",
    ]);
    expect(JSON.stringify(result.moveLogs)).not.toMatch(/event-|committed|reducer/i);
  });

  it("increments stateID once for every accepted typed command and never for rejection", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "command-version",
      player1Id: PLAYER_A,
      player2Id: PLAYER_B,
      cardsMaps: cardsMaps(),
      cardDefinitions: cardDefinitions(),
    });
    const passed = applyFabCommand(state, { actorId: PLAYER_A, command: { move: "pass" } });
    expect(passed).toMatchObject({ success: true, stateID: state.stateID + 1 });
    const rejected = applyFabCommand(state, { actorId: PLAYER_B, command: { move: "end-turn" } });
    expect(rejected).toMatchObject({ success: false, currentStateID: state.stateID });
    expect(state.stateID).toBe(0);
  });

  it("returns a private semantic log when a typed command awaits a decision", () => {
    const actorId = "player-1";
    const opponentId = "player-2";
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

    const result = game.getRuntime().applyCommand(actorId, {
      move: "begin-play",
      instanceId,
      target: opponentId,
    });

    expect(result).toMatchObject({ success: true, status: "awaiting-decision" });
    if (!result.success) throw new Error(result.error);
    expect(result.moveLogs).toHaveLength(2);
    expect(result.moveLogs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          public: [expect.objectContaining({ key: "flesh-and-blood.decision.awaiting" })],
          privateByPlayerId: {
            [actorId]: [expect.objectContaining({ key: "flesh-and-blood.decision.private" })],
          },
        }),
      ]),
    );
  });

  it("rejects end-turn from the non-active player", () => {
    const runtime = new FabMatchRuntime(
      FabTestEngine.createStateForRulesTest({
        seed: "guard",
        player1Id: PLAYER_A,
        player2Id: PLAYER_B,
        cardsMaps: cardsMaps(),
        cardDefinitions: cardDefinitions(),
      }),
    );
    const result = runtime.applyCommand(PLAYER_B, { move: "end-turn" });
    expect(result.success).toBe(false);
    expect(runtime.getActivePlayerId()).toBe(PLAYER_A);
  });

  it("ends the game with the opponent as winner on concede", () => {
    const runtime = new FabMatchRuntime(
      FabTestEngine.createStateForRulesTest({
        seed: "concede",
        player1Id: PLAYER_A,
        player2Id: PLAYER_B,
        cardsMaps: cardsMaps(),
        cardDefinitions: cardDefinitions(),
      }),
    );
    const result = runtime.applyCommand(PLAYER_A, { move: "concede" });
    expect(result).toMatchObject({ success: true, status: "game-ended" });
    expect(runtime.hasGameEnded()).toBe(true);
    expect(runtime.getGameEndResult()?.winnerId).toBe(PLAYER_B);
  });

  it("hides the deck order from its owner and keeps own hand visible", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "view",
      player1Id: PLAYER_A,
      player2Id: PLAYER_B,
      cardsMaps: cardsMaps(),
      cardDefinitions: cardDefinitions(),
    });
    const view = projectFabViewerState(state, { role: "player", actorId: PLAYER_A });
    // The owner's own deck order is hidden information (CR 3.0.3a).
    expect(view.players[PLAYER_A]!.zones.deck.every((id) => id === FAB_FACE_DOWN)).toBe(true);
    // The owner still sees their own hand.
    expect(view.players[PLAYER_A]!.zones.hand.every((id) => id !== FAB_FACE_DOWN)).toBe(true);
  });

  it("hides an opponent's private zones but exposes public ones", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "view-public",
      player1Id: PLAYER_A,
      player2Id: PLAYER_B,
      cardsMaps: cardsMaps(),
      cardDefinitions: cardDefinitions(),
    });
    // Seed an opponent's public (pitch, graveyard) and private (hand) zones.
    const [opponentPitch, opponentGraveyard, opponentHand] = state.containers.zonesByPlayerId[
      PLAYER_B
    ]!.deck.splice(0, 3);
    state.containers.zonesByPlayerId[PLAYER_B]!.pitch.push(opponentPitch);
    state.containers.zonesByPlayerId[PLAYER_B]!.graveyard.push(opponentGraveyard);
    state.containers.zonesByPlayerId[PLAYER_B]!.hand.push(opponentHand);

    const view = projectFabViewerState(state, { role: "player", actorId: PLAYER_A });
    // Private zones are face-down.
    expect(view.players[PLAYER_B]!.zones.hand.every((id) => id === FAB_FACE_DOWN)).toBe(true);
    expect(view.players[PLAYER_B]!.zones.deck.every((id) => id === FAB_FACE_DOWN)).toBe(true);
    expect(view.players[PLAYER_B]!.zones.arsenal.every((id) => id === FAB_FACE_DOWN)).toBe(true);
    // Public zones retain real instance ids (CR 3.0.4a / 3.14.1).
    expect(view.players[PLAYER_B]!.zones.pitch).toContain(opponentPitch);
    expect(view.players[PLAYER_B]!.zones.graveyard).toContain(opponentGraveyard);
  });

  it("projects tapped state and rules counters only for public objects", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "view-public-object-state",
      player1Id: PLAYER_A,
      player2Id: PLAYER_B,
      cardsMaps: cardsMaps(),
      cardDefinitions: cardDefinitions(),
    });
    const [publicObject, privateObject] = state.containers.zonesByPlayerId[PLAYER_B]!.deck.splice(
      0,
      2,
    );
    state.containers.zonesByPlayerId[PLAYER_B]!.pitch.push(publicObject!);
    state.containers.zonesByPlayerId[PLAYER_B]!.hand.push(privateObject!);
    state.objects[publicObject!] = {
      ...state.objects[publicObject!]!,
      visibility: "public",
      markers: [{ kind: "tapped" }],
      counters: [{ kind: "named", name: "steam", count: 2 }],
    };
    state.objects[privateObject!] = {
      ...state.objects[privateObject!]!,
      visibility: "private",
      markers: [{ kind: "tapped" }],
      counters: [{ kind: "named", name: "steam", count: 3 }],
    };

    const view = projectFabViewerState(state, { role: "player", actorId: PLAYER_A });

    expect(view.tappedInstanceIds).toEqual([publicObject]);
    expect(view.countersByInstanceId).toEqual({
      [publicObject!]: [{ kind: "named", name: "steam", count: 2 }],
    });
  });

  it("projects hosted cards by their top-card visibility without duplicating zone membership", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "view-hosted-cards",
      player1Id: PLAYER_A,
      player2Id: PLAYER_B,
      cardsMaps: cardsMaps(),
      cardDefinitions: cardDefinitions(),
    });
    const [publicHost, publicSubcard, privateHost, privateSubcard] =
      state.containers.zonesByPlayerId[PLAYER_B]!.deck.splice(0, 4);
    state.containers.zonesByPlayerId[PLAYER_B]!.arena.push(publicHost!);
    state.containers.zonesByPlayerId[PLAYER_B]!.inventory.push(privateHost!);
    state.objects[publicHost!] = { ...state.objects[publicHost!]!, visibility: "public" };
    state.objects[privateHost!] = { ...state.objects[privateHost!]!, visibility: "private" };
    state.containers.subcardsByHostId = {
      [publicHost!]: [fabObjectInstanceId(publicSubcard!)],
      [privateHost!]: [fabObjectInstanceId(privateSubcard!)],
    };

    const opponentView = projectFabViewerState(state, { role: "player", actorId: PLAYER_A });
    expect(opponentView.subcardsByHostId[publicHost!]).toEqual([publicSubcard]);
    expect(opponentView.subcardsByHostId[privateHost!]).toEqual([FAB_FACE_DOWN]);
    expect(opponentView.players[PLAYER_B]!.zones.under).toEqual([]);
    expect(
      projectFabViewerResources(state, { role: "player", actorId: PLAYER_A }).cardInstances,
    ).toHaveProperty(publicSubcard!);
    expect(
      projectFabViewerResources(state, { role: "player", actorId: PLAYER_A }).cardInstances,
    ).not.toHaveProperty(privateSubcard!);

    const ownerView = projectFabViewerState(state, { role: "player", actorId: PLAYER_B });
    expect(ownerView.subcardsByHostId[privateHost!]).toEqual([privateSubcard]);
  });

  it("projects evaluated combat values without persisting derived combat caches", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "view-evaluated-combat",
      player1Id: PLAYER_A,
      player2Id: PLAYER_B,
      cardsMaps: cardsMaps(),
      cardDefinitions: cardDefinitions(),
    });
    const attackInstanceId = `${PLAYER_A}-card-0`;
    state.cardDefinitions["card-0"] = registerFabCardDefinition({
      canonicalId: "card-0",
      name: "Evaluated Attack",
      types: ["Action", "Attack"],
      power: 4,
      keywords: [{ name: "go-again" }],
      abilities: [
        {
          id: "evaluated-attack-on-hit",
          kind: "static",
          staticKind: "triggered",
          text: "When this hits, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: { kind: "player", player: "ability-controller" },
              observes: { kind: "source", selector: "attack" },
            },
          },
          resolution: { kind: "effect", effect: { type: "draw", count: 1, player: "controller" } },
        },
      ],
    });
    for (const zone of Object.values(state.containers.zonesByPlayerId[PLAYER_A]!)) {
      const index = zone.indexOf(attackInstanceId);
      if (index >= 0) zone.splice(index, 1);
    }
    state.containers.zonesByPlayerId[PLAYER_A]!.combatChain.push(attackInstanceId);
    state.combat = {
      open: true,
      step: "attack",
      defenseDeclarationPending: false,
      activeLink: {
        activeAttack: { kind: "card", sourceObjectId: fabObjectInstanceId(attackInstanceId) },
        attackingPlayerId: fabPlayerId(PLAYER_A),
        defendingPlayerId: fabPlayerId(PLAYER_B),
        attackTargetRef: {
          kind: "hero",
          playerId: fabPlayerId(PLAYER_B),
        },
        defendingInstanceIdsByTarget: { [PLAYER_B]: [] },
        defendingOrigins: {},
        damage: { status: "pending", outcomes: [] },
        wagers: [],
      },
    };

    const view = projectFabViewerState(state, { role: "player", actorId: PLAYER_A });

    expect(view.combat?.activeLink).toMatchObject({
      attackPower: 4,
      keywords: ["go-again", "on-hit"],
    });
    expect(state.combat?.activeLink).not.toHaveProperty("attackPower");
    expect(state.combat?.activeLink).not.toHaveProperty("keywords");
  });
});
