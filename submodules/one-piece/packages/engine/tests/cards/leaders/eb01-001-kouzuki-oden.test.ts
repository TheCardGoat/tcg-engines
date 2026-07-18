import { describe, expect, test } from "vite-plus/test";
import { eb01Izo002, eb01KouzukiOden001, eb01MountainGod018, eb01Yamato007 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-001 Kouzuki Oden", () => {
  test("grants +1000 Counter to a compound Land of Wano Character without printed Counter", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Yamato007, playedOnTurn: 0 }] },
      { leaderCardId: eb01KouzukiOden001, hand: [eb01Izo002], life: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Yamato007);
    const counterId = engine.findCardInZone("north", "hand", eb01Izo002);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const decision = engine.pendingDecision("battleCounter", "north");
    const counterStep = decision.steps[0];
    expect(counterStep?.kind).toBe("selectEntity");
    if (counterStep?.kind !== "selectEntity") {
      throw new Error("Expected an effective Counter card choice.");
    }
    expect(counterStep.candidates).toContainEqual(
      expect.objectContaining({ ref: expect.objectContaining({ id: counterId }) }),
    );
    engine.resolveDecision("battleCounter", { selectedIds: [counterId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      counterId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("keeps its printed attack bonus through the opponent turn while DON!! power turns off", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb01KouzukiOden001,
        character: [eb01MountainGod018],
        activeDon: 1,
      },
      { life: 3 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const leaderId = engine.leader("south");
    engine.attachDon(leaderId, 1, "south");
    engine.declareAttack(leaderId, engine.leader("north"), "south");

    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
