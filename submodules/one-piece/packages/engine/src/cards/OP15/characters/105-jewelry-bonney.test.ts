import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005 } from "@tcg/op-cards";
import { op15JewelryBonney105 } from "../../../../../cards/src/cards/characters/op15-105-jewelry-bonney.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-105 Jewelry Bonney", () => {
  test("saves a threatened Character and pays top Life to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15JewelryBonney105, eb01Doma005], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === domaId)).toBe(true);
    expect(south.lifeCount).toBe(lifeBefore - 1);
    expect(south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the replacement lets the K.O. through", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15JewelryBonney105], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const bonneyId = engine.findCardInZone("south", "character", op15JewelryBonney105);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bonneyId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(bonneyId);
    expect(south.hand).toHaveLength(0);
  });
});
