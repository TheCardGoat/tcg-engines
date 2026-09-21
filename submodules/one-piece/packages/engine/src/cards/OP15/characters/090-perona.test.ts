import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005, op02IceAge117 } from "@tcg/op-cards";
import { op15Perona090 } from "../../../../../cards/src/cards/characters/op15-090-perona.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-090 Perona", () => {
  test("saves a threatened Character by trashing a hand card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Perona090, eb01Doma005],
        hand: [op02IceAge117],
        activeDon: 2,
      },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    const iceAgeId = engine.findCardInZone("south", "hand", op02IceAge117);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    // The lone hand card is trashed automatically.
    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === domaId)).toBe(true);
    expect(south.trash.map((card) => card.instanceId)).toContain(iceAgeId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-090", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-090",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
