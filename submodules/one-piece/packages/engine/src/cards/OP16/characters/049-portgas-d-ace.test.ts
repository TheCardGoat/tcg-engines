import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-049 Portgas.D.Ace", () => {
  test("[Activate: Main] resting this Character draws 1 card", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-049"], hand: ["OP13-013"], activeDon: 5 },
      {},
    );
    const aceId = engine.findCardInZone("south", "character", "OP16-049");

    engine.activateEffect(aceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.find((card) => card?.instanceId === aceId)?.rested).toBe(true);
    expect(south.hand).toHaveLength(2);
  });

  test("declining keeps the Character active and draws nothing", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-049"], hand: ["OP13-013"], activeDon: 5 },
      {},
    );
    const aceId = engine.findCardInZone("south", "character", "OP16-049");

    engine.activateEffect(aceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.find((card) => card?.instanceId === aceId)?.rested).toBe(false);
    expect(south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
