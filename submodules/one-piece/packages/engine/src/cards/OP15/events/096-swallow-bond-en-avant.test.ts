import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-096 Swallow Bond: En Avant", () => {
  test("[Main] resting a DON!! with a Straw Hat Leader trashes 5 deck cards", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-022", hand: ["OP15-096"], deck: 8, trash: [], activeDon: 5 },
      {},
    );

    engine.playCard("OP15-096");
    engine.acceptLeadingOptional("south");

    const south = engine.getView("south").players.south;
    expect(south.deckCount).toBe(3);
    // Five deck cards plus the resolved event itself.
    expect(south.trash).toHaveLength(6);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a Straw Hat Leader the Main effect is not offered", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-096"], deck: 8, trash: [], activeDon: 5 },
      {},
    );

    engine.playCard("OP15-096");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.deckCount).toBe(8);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
