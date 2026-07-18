import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op02Zephyr072 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-072 Zephyr", () => {
  test("lets its controller pay DON!! -4, K.O. the cost-3 boundary, and gain 1000 power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op02Zephyr072, activeDon: 4 },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01MountainGod018, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const koId = engine.findCardInZone("north", "character", eb01Doma005);
    const attackTargetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(engine.leader("south"), attackTargetId, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const step = targetDecision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected Zephyr's controller to choose an opposing low-cost Character.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([koId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackTargetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(koId);
    expect(view.players.north.characters.some((card) => card?.instanceId === attackTargetId)).toBe(
      true,
    );
    expect(view.players.south.leader.power).toBe(6000);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 4);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
