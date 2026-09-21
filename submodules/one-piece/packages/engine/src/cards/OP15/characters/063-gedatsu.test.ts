import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005, op03Boodle050 } from "@tcg/op-cards";
import { op15Gedatsu063 } from "../../../../../cards/src/cards/characters/op15-063-gedatsu.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-063 Gedatsu", () => {
  test("[On Play] pays DON!! 1 to draw 1 card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Gedatsu063], activeDon: 3, deck: [eb01Doma005, eb01Doma005] },
      {},
    );
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard("OP15-063");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
  });

  test("[On K.O.] K.O.s an opposing Character with 2000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Gedatsu063], activeDon: 2 },
      {
        character: [op03Boodle050, eb01Doma005],
        hand: [eb01ConquererOfThreeWorldsRagnaraku039],
        activeDon: 5,
        restedDon: 1,
      },
    );
    const gedatsuId = engine.findCardInZone("south", "character", op15Gedatsu063);
    const boodleId = engine.findCardInZone("north", "character", op03Boodle050);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [gedatsuId] }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Gedatsu's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([boodleId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boodleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      boodleId,
    );
  });

  test("[On Play] may be declined", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-063"], activeDon: 3 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP15-063");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-063",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const gedatsu = "OP15-063";
    const engine = OnePieceTestEngine.create(
      { hand: [gedatsu], activeDon: 3 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(gedatsu);
    const gate = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    const gateIntent = gate?.extensions?.resolutionIntent;
    if (gateIntent === "effectOptional") {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    } else if (gateIntent) {
      const gateStep = engine.pendingDecision(gateIntent as never, "south").steps[0];
      if (gateStep?.kind === "selectEntity" || gateStep?.kind === "orderItems") {
        engine.resolveDecision(gateIntent as never, { selectedIds: [] }, "south");
      } else if (gateStep?.kind === "chooseOption") {
        engine.resolveDecision(gateIntent as never, { optionId: "0" }, "south");
      }
    }

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      gedatsu,
    );
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
