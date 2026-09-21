import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-033 Morley", () => {
  test("may rest 2 of your cards instead of being K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP16-033", rested: true }, "EB01-005", "OP16-004"],
      },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const morleyId = engine.findCardInZone("south", "character", "OP16-033");
    const domaId = engine.findCardInZone("south", "character", "EB01-005");
    const curielId = engine.findCardInZone("south", "character", "OP16-004");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-033");
    const replacement = engine.pendingDecision("battleKoReplacement", "south").steps[0];
    if (replacement?.kind !== "confirm") throw new Error("Expected the replacement confirm.");
    engine.resolveDecision("battleKoReplacement", { optionId: "yes" }, "south");

    // Rest Doma and Curiel to satisfy the replacement.
    const rest = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
    if (rest?.kind !== "payCost") throw new Error("Expected the rest selection.");
    engine.resolveDecision(
      "effectMixedRestSelection",
      { selectedIds: [domaId, curielId] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.instanceId)).toContain(morleyId);
    expect(south.characters.find((card) => card?.instanceId === domaId)?.rested).toBe(true);
    expect(south.characters.find((card) => card?.instanceId === curielId)?.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the replacement lets the K.O. resolve", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-033", rested: true }, "EB01-005"] },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const morleyId = engine.findCardInZone("south", "character", "OP16-033");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-033");
    const replacement = engine.pendingDecision("battleKoReplacement", "south").steps[0];
    if (replacement?.kind !== "confirm") throw new Error("Expected the replacement confirm.");
    engine.resolveDecision("battleKoReplacement", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      morleyId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
