import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-002 Izo", () => {
  test("[On Play] revealing an 8000-power Character draws 1 card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-002", "OP16-004", "OP13-013"], activeDon: 1 },
      {},
    );

    engine.playCard("OP16-002");
    // Exactly one eligible card exists, so the reveal cost auto-pays.
    engine.acceptLeadingOptional("south");

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toHaveLength(3);
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-004");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the reveal draws nothing", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-002", "OP16-004", "OP13-013"], activeDon: 1 },
      {},
    );

    engine.playCard("OP16-002");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without an 8000-power Character in hand the draw is not offered", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-002", "OP13-013"], activeDon: 1 }, {});

    engine.playCard("OP16-002");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
