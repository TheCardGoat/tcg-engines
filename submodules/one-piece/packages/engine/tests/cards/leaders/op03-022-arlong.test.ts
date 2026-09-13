import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Arlong022, op03Hatchan033 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-022 Arlong", () => {
  test("pays one DON!! to play only a cost-4-or-less Character with Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Arlong022,
        hand: [op03Hatchan033, eb01Doma005],
        activeDon: 3,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hatchanId = engine.findCardInZone("south", "hand", op03Hatchan033);
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.attachDon(engine.leader("south"), 2, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const decision = engine.pendingDecision("effectPlaySelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected Arlong's controller to choose a Character with Trigger.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([hatchanId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [hatchanId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(hatchanId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.players.south.leader.attachedDon).toBe(2);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Arlong022,
        hand: [op03Hatchan033, eb01Doma005],
        activeDon: 3,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.attachDon(engine.leader("south"), 2, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
