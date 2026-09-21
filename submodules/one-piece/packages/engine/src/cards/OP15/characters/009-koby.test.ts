import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005 } from "@tcg/op-cards";
import { op15Enel060 } from "../../../../../cards/src/cards/characters/op15-060-enel.ts";
import { op15Koby009 } from "../../../../../cards/src/cards/characters/op15-009-koby.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-009 Koby", () => {
  test("keeps a 7000-or-less base power Character on the field for -2000 Leader power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Koby009, eb01Doma005], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const kobyId = engine.findCardInZone("south", "character", op15Koby009);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kobyId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === kobyId)).toBe(true);
    expect(south.leader?.power).toBe(3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the replacement lets the K.O. through", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Koby009], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const kobyId = engine.findCardInZone("south", "character", op15Koby009);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kobyId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(kobyId);
    expect(south.leader?.power).toBe(5000);
  });

  test("does not replace removal of a Character above 7000 base power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Koby009, op15Enel060], activeDon: 7 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const hugeId = engine.findCardInZone("south", "character", op15Enel060);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hugeId] }, "north");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(hugeId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
