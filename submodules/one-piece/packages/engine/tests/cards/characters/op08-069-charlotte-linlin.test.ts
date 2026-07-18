import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op08CharlotteLinlin069,
  op08CharlotteSmoothie065,
  op08CountNiwatori071,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-069 Charlotte Linlin", () => {
  test("pays its On Play costs, gains Life, and puts a cost-6 opposing Character face-up at bottom Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08CharlotteLinlin069, eb01Doma005, eb01Fourtricks025],
        life: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005],
        activeDon: 10,
      },
      {
        character: [op08CountNiwatori071, op08CharlotteSmoothie065],
        life: [eb01Doma005],
        deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const fillerId = engine.findCardInZone("south", "hand", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", op08CountNiwatori071);
    const tooExpensiveId = engine.findCardInZone("north", "character", op08CharlotteSmoothie065);
    const southLifeBefore = engine.getView("south").players.south.lifeCount;
    const northLifeBefore = engine.getView("south").players.north.lifeCount;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op08CharlotteLinlin069, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [fillerId] }, "south");

    const gainLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    expect(gainLife?.kind).toBe("chooseOption");
    if (gainLife?.kind !== "chooseOption") throw new Error("Expected Linlin's own Life choice.");
    expect(gainLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity")
      throw new Error("Expected Linlin's opposing Character choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const position = engine.pendingDecision("effectLifePosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption")
      throw new Error("Expected Linlin's Life-position choice.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(southLifeBefore + 1);
    expect(view.players.north.lifeCount).toBe(northLifeBefore + 1);
    expect(view.players.north.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      false,
    );
    expect(view.players.north.life.at(-1)).toMatchObject({
      cardId: op08CountNiwatori071.id,
      hidden: false,
    });
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(fillerId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });
});
