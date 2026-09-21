import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-076 The Three Admirals", () => {
  test("[Main] resting 3 DON!! resolves the boost with no Admiral Characters available", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-076"], activeDon: 6 }, {});

    engine.playCard("OP16-076");
    engine.acceptLeadingOptional("south");
    // No {Admiral} type Characters exist in the catalog: the boost auto-declines.
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the rest keeps the DON!! active", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-076"], activeDon: 6 }, {});

    engine.playCard("OP16-076");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
