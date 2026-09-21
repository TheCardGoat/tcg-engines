import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039 } from "@tcg/op-cards";
import { op15Brook032 } from "../../../../../cards/src/cards/characters/op15-032-brook.ts";
import { eb01Fourtricks025 } from "@tcg/op-cards";
import { op15RoronoaZoro094 } from "../../../../../cards/src/cards/characters/op15-094-roronoa-zoro.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-094 Roronoa Zoro", () => {
  test("saves a threatened Straw Hat Character by trashing itself", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15RoronoaZoro094, op15Brook032], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const zoroId = engine.findCardInZone("south", "character", op15RoronoaZoro094);
    const brookId = engine.findCardInZone("south", "character", op15Brook032);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [brookId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === brookId)).toBe(true);
    expect(south.trash.map((card) => card.instanceId)).toContain(zoroId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not replace removal of a non-Straw-Hat Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15RoronoaZoro094, eb01Fourtricks025], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const fourtricksId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [fourtricksId] }, "north");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(fourtricksId);
    expect(south.characters.some((card) => card?.cardId === "OP15-094")).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
