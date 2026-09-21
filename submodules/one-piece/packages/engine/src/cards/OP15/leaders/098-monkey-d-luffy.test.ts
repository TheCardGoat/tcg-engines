import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Fourtricks025 } from "@tcg/op-cards";
import { op15Enel060 } from "../../../../../cards/src/cards/characters/op15-060-enel.ts";
import { op15MonkeyDLuffy098 } from "../../../../../cards/src/cards/leaders/op15-098-monkey-d-luffy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-098 Monkey.D.Luffy", () => {
  test("keeps a 6000+ base power Sky Island Character on the field by paying 1 Life when removed", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15MonkeyDLuffy098, character: [op15Enel060], activeDon: 7 },
      {
        hand: [eb01ConquererOfThreeWorldsRagnaraku039, eb01ConquererOfThreeWorldsRagnaraku039],
        activeDon: 5,
        restedDon: 1,
      },
    );
    const enelId = engine.findCardInZone("south", "character", op15Enel060);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(enelId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [enelId] }, "north");

    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === enelId)).toBe(true);
    expect(south.trash.map((card) => card.instanceId)).not.toContain(enelId);
    expect(south.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("removes a Character without the Sky Island trait normally", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15MonkeyDLuffy098, character: [eb01Fourtricks025], activeDon: 7 },
      {
        hand: [eb01ConquererOfThreeWorldsRagnaraku039],
        activeDon: 5,
        restedDon: 1,
      },
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
    expect(south.characters.some((card) => card?.instanceId === fourtricksId)).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
