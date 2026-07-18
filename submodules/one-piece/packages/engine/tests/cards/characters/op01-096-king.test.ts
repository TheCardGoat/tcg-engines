import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op01Killer039, op01King096 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-096 King", () => {
  test("returns two DON!! and resolves both printed K.O. choices with separate cost bounds", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01King096],
        activeDon: op01King096.cost + 2,
      },
      {
        character: [eb01Fourtricks025, op01Killer039, eb01MountainGod018],
      },
    );
    const costThreeId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const costTwoId = engine.findCardInZone("north", "character", op01Killer039);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op01King096, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "active-don:1"] },
      "south",
    );

    const firstKo = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(firstKo?.kind).toBe("selectEntity");
    if (firstKo?.kind !== "selectEntity") throw new Error("Expected King's cost-3 K.O. choice.");
    expect(firstKo.candidates.map((candidate) => candidate.ref.id)).toEqual([
      costThreeId,
      costTwoId,
    ]);
    expect(firstKo.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costThreeId] }, "south");

    const secondKo = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(secondKo?.kind).toBe("selectEntity");
    if (secondKo?.kind !== "selectEntity") throw new Error("Expected King's cost-2 K.O. choice.");
    expect(secondKo.candidates.map((candidate) => candidate.ref.id)).toEqual([costTwoId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costTwoId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([costThreeId, costTwoId]),
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
