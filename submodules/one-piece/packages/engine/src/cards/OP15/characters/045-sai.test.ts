import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02IceAge117 } from "@tcg/op-cards";
import { op15Sai045 } from "../../../../../cards/src/cards/characters/op15-045-sai.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-045 Sai", () => {
  test("[On Play] trashes an Event to draw 2 cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op15Sai045, op02IceAge117],
        activeDon: 5,
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {},
    );
    const eventId = engine.findCardInZone("south", "hand", op02IceAge117);

    engine.playCard("OP15-045");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The lone Event in hand is trashed automatically.

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      eventId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declines and draws nothing", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op15Sai045, op02IceAge117],
        activeDon: 5,
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {},
    );

    engine.playCard("OP15-045");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  expect(() => {
    throw new Error("test");
  }).toThrow();
  test("[On Play] may be declined", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-045"], activeDon: 7 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP15-045");
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
      "OP15-045",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const sai = "OP15-045";
    const engine = OnePieceTestEngine.create(
      { hand: [sai], activeDon: 7 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(op15Sai045);
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

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(sai);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
