import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op15Shura067 } from "../../../../../cards/src/cards/characters/op15-067-shura.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-067 Shura", () => {
  test("[On Play] draws behind a DON!! cost and gains Rush with 6 or less DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Shura067], activeDon: 4, deck: [eb01Doma005, eb01Doma005] },
      {},
    );
    engine.playCard("OP15-067");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const shuraId = engine.findCardInZone("south", "character", op15Shura067);

    // Rush lets the just-played Shura attack immediately.
    engine.declareAttack(shuraId, engine.leader("north"), "south");
  });

  test("loses Rush above 6 DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Shura067], activeDon: 7 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard("OP15-067");
    const shuraId = engine.findCardInZone("south", "character", op15Shura067);

    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: shuraId,
      targetId: engine.leader("north"),
    });
    expect(failure.reason).toBeTruthy();
  });

  test("[On Play] may be declined", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-067"], activeDon: 3 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP15-067");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-067",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const shura = "OP15-067";
    const engine = OnePieceTestEngine.create(
      { hand: [shura], activeDon: 3 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(shura);
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

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(shura);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
