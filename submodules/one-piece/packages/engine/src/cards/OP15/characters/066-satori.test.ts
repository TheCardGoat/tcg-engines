import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op03Boodle050 } from "../../../../../cards/src/cards/characters/op03-050-boodle.ts";
import { op15Satori066 } from "../../../../../cards/src/cards/characters/op15-066-satori.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-066 Satori", () => {
  test("[On Play] pays DON!! 1 to draw 1 card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Satori066], activeDon: 3, deck: [eb01Doma005, eb01Doma005] },
      {},
    );
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard("OP15-066");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
  });

  test("[When Attacking] rearranges the top 2 deck cards under the 6-DON gate", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Satori066],
        activeDon: 4,
        deck: [op03Boodle050, eb01Doma005, eb01Fourtricks025],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const satoriId = engine.findCardInZone("south", "character", op15Satori066);

    engine.declareAttack(satoriId, engine.leader("north"), "south");

    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the order choice.");
    const ids = order.candidates.map((candidate) => candidate.ref.id);
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: [ids[1], ids[0]] }, "south");

    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    if (position?.kind !== "chooseOption") throw new Error("Expected the position choice.");
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "top" }, "south");

    expect(engine.getView("south").players.south.deckCount).toBe(3);
  });

  test("[On Play] may be declined", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-066"], activeDon: 3 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP15-066");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-066",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const satori = "OP15-066";
    const engine = OnePieceTestEngine.create(
      { hand: [satori], activeDon: 3 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(satori);
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
      satori,
    );
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
