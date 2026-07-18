import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op04Apis041,
  op04IceOni047,
  op04Kuro023,
} from "@tcg/op-cards";

import { completeBattleResolution } from "../../../src/battle.ts";
import { drainResolutionQueue } from "../../../src/engine/queue.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-047 Ice Oni", () => {
  test("bottom-decks only the cost-5-or-less Character it battled after that battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04IceOni047, playedOnTurn: 0 }] },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const iceOniId = engine.findCardInZone("south", "character", op04IceOni047);
    const battledId = engine.findCardInZone("north", "character", eb01Doma005);
    const otherEligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.declareAttack(iceOniId, battledId, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === battledId)).toBe(
      false,
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === otherEligibleId)).toBe(
      true,
    );
    expect(engine.getState().players.north.deck.at(-1)).toBe(battledId);
    expect(engine.getState().battle).toBeNull();
    expect(view.prompts).toHaveLength(0);
  });

  test("does not move a battled Character with a cost of 6 or more", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04IceOni047, playedOnTurn: 0 }] },
      { character: [{ card: op04Kuro023, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const iceOniId = engine.findCardInZone("south", "character", op04IceOni047);
    const kuroId = engine.findCardInZone("north", "character", op04Kuro023);

    engine.declareAttack(iceOniId, kuroId, "south");

    expect(
      engine.getView("south").players.north.characters.some((card) => card?.instanceId === kuroId),
    ).toBe(true);
    expect(engine.getState().players.north.deck).not.toContain(kuroId);
    expect(engine.getState().battle).toBeNull();
  });

  test("leaves a battled Character in trash when the battle already K.O.'d it", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04IceOni047, attachedDon: 4, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const iceOniId = engine.findCardInZone("south", "character", op04IceOni047);
    const battledId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(iceOniId, battledId, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(battledId);
    expect(engine.getState().players.north.deck).not.toContain(battledId);
    expect(engine.getState().battle).toBeNull();
    expect(view.prompts).toHaveLength(0);
  });

  test("does not bottom-deck the opposing attacker during the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04Apis041, op04Apis041],
        character: [{ card: op04IceOni047, playedOnTurn: 0, rested: true }],
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const iceOniId = engine.findCardInZone("south", "character", op04IceOni047);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const counterIds = engine
      .getView("south")
      .players.south.hand.map((card) => card.instanceId)
      .filter((instanceId): instanceId is string => instanceId !== null);

    engine.declareAttack(attackerId, iceOniId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: counterIds }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === attackerId)).toBe(
      true,
    );
    expect(engine.getState().players.north.deck).not.toContain(attackerId);
    expect(view.players.south.characters.some((card) => card?.instanceId === iceOniId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("queues completion once and finalizes only after end-of-battle effects resolve", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04IceOni047, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const state = engine.getState();
    const iceOniId = engine.findCardInZone("south", "character", op04IceOni047);
    const battledId = engine.findCardInZone("north", "character", eb01Doma005);
    state.battle = {
      id: "battle:idempotency",
      attackerId: iceOniId,
      originalTargetId: battledId,
      targetId: battledId,
      defendingSeat: "north",
      step: "complete",
      blockerId: null,
      counterCardIds: [],
      counterTotal: 0,
      attackPower: 0,
      defensePower: 3000,
      damageRemaining: null,
      result: "no_damage",
    };

    completeBattleResolution(state);
    completeBattleResolution(state);
    expect(state.resolutionQueue.filter((item) => item.kind === "battleEndEffects")).toHaveLength(
      1,
    );
    expect(state.battle?.completionQueued).toBe(true);

    drainResolutionQueue(state);

    expect(state.players.north.deck.at(-1)).toBe(battledId);
    expect(state.battle).toBeNull();
    const queuedKinds = state.eventHistory
      .filter((event) => event.type === "resolutionQueued")
      .map((event) => event.payload.kind);
    expect(queuedKinds.indexOf("battleEndEffects")).toBeLessThan(
      queuedKinds.indexOf("effectBlock"),
    );
    expect(queuedKinds.indexOf("effectBlock")).toBeLessThan(
      queuedKinds.indexOf("battleCleanupFinalize"),
    );
  });
});
