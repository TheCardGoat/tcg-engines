import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op15Ohm061 } from "../../../../../cards/src/cards/characters/op15-061-ohm.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-061 Ohm", () => {
  test("[On Play] pays DON!! 1 to draw 1 card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Ohm061], activeDon: 3, deck: [eb01Doma005, eb01Doma005] },
      {},
    );
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard("OP15-061");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[When Attacking] gives an opposing Character -1000 power with 6 or less DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Ohm061], activeDon: 4 },
      { character: [eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ohmId = engine.findCardInZone("south", "character", op15Ohm061);
    const fourtricksId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.declareAttack(ohmId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Ohm's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([fourtricksId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [fourtricksId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === fourtricksId)
        ?.power,
    ).toBe(4000);
  });

  test("[On Play] may be declined", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-061"], activeDon: 3 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP15-061");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-061",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const ohm = "OP15-061";
    const engine = OnePieceTestEngine.create(
      { hand: [ohm], activeDon: 3 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(ohm);
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

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(ohm);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
