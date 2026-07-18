import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03Lilith058,
  eb03SSnake059,
  op01Shanks120,
  op06MonkeyDLuffy013,
  op07Vegapunk097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-059 S-Snake", () => {
  test("puts only a Trigger Character from hand on top of Life face-up with an included Egghead Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07Vegapunk097,
      hand: [eb03SSnake059, eb03Lilith058, eb01Doma005],
      life: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: eb03SSnake059.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", eb03Lilith058);
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(eb03SSnake059, "south");

    const selection = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") {
      throw new Error("Expected S-Snake's Trigger Character choice.");
    }
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(selection.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getState().players.south.life[0]).toBe(eligibleId);
    expect(engine.getState().cards[eligibleId]?.faceUp).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger excludes Monkey.D.Luffy and cost-7 Characters, and prevents the chosen Character from attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: op06MonkeyDLuffy013, playedOnTurn: 0 },
          { card: op01Shanks120, playedOnTurn: 0 },
        ],
      },
      {
        life: [eb03SSnake059],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", eb03SSnake059);
    const restrictedId = engine.findCardInZone("south", "character", eb01Doma005);
    const luffyId = engine.findCardInZone("south", "character", op06MonkeyDLuffy013);
    const expensiveId = engine.findCardInZone("south", "character", op01Shanks120);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected S-Snake's attack restriction.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(restrictedId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(luffyId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restrictedId] }, "north");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: restrictedId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      triggerId,
    );
  });
});
