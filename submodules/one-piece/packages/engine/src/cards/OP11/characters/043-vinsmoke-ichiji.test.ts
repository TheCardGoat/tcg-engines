import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op11Hatchan034,
  op11VinsmokeIchiji043,
  op11VinsmokeNiji045,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-043 Vinsmoke Ichiji", () => {
  test("on the opponent's attack, its controller chooses a battle target before the deck trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11VinsmokeIchiji043, op11VinsmokeNiji045],
        deck: Array.from({ length: 8 }, () => eb01Doma005),
      },
      {
        character: [
          { card: op11Hatchan034, playedOnTurn: 0 },
          { card: op11Hatchan034, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackers = engine
      .getView("south")
      .players.north.characters.flatMap((card) => (card ? [card.instanceId] : []));
    const ichijiId = engine.findCardInZone("south", "character", op11VinsmokeIchiji043);
    const deckBefore = engine.getView("south").players.south.deckCount;
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackers[0]!, engine.leader("south"), "north");
    const power = engine.pendingDecision("effectTargetSelection", "south");
    expect(power.actorId).toBe("south");
    const powerStep = power.steps[0];
    if (powerStep?.kind !== "selectEntity") throw new Error("Expected Ichiji's battle target.");
    expect(powerStep).toMatchObject({ min: 0, max: 1 });
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), ichijiId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 2);
    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Ichiji's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(ichijiId);
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);

    engine.declareAttack(attackers[1]!, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 2);
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.south.leader.power).toBe(5000);
  });

  test("a non-GERMA Character prevents the opponent-attack effect without disabling Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11VinsmokeIchiji043, eb01Doma005],
        deck: Array.from({ length: 8 }, () => eb01Doma005),
      },
      { character: [{ card: op11Hatchan034, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", op11Hatchan034);
    const ichijiId = engine.findCardInZone("south", "character", op11VinsmokeIchiji043);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Ichiji's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(ichijiId);
    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore);
  });
});
