import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-033 Morley", () => {
  test.each(["battle", "effect"] as const)(
    "does not replace another Character's %s K.O.",
    (cause) => {
      const engine = OnePieceTestEngine.create(
        { character: ["OP16-033", { cardId: "EB01-005", rested: true }], activeDon: 2 },
        { character: [{ cardId: "OP16-003", playedOnTurn: 0 }], hand: ["ST01-015"], activeDon: 4 },
        { firstPlayer: "south", activeSeat: "north" },
      );
      const ally = engine.findCardInZone("south", "character", "EB01-005");
      const morley = engine.findCardInZone("south", "character", "OP16-033");
      if (cause === "battle") engine.asNorth().attack("OP16-003", "EB01-005");
      else {
        engine.playCard("ST01-015", "north");
        engine.resolveDecision("effectTargetSelection", { selectedIds: [ally] }, "north");
      }
      const view = engine.getView("south");
      expect(view.players.south.trash.map((card) => card.instanceId)).toContain(ally);
      expect(view.players.south.characters.some((card) => card?.instanceId === morley)).toBe(true);
      expect(view.players.south.activeDon).toBe(2);
      expect(view.prompts).toHaveLength(0);
    },
  );

  test("Unblockable bypasses an active opposing Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-033", playedOnTurn: 0 }] },
      { character: ["OP16-044"], hand: [], life: 3 },
    );
    const attackerId = engine.findCardInZone("south", "character", "OP16-033");
    const blockerId = engine.findCardInZone("north", "character", "OP16-044");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(2);
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may rest its own Leader and itself to replace its own effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-033"] },
      { hand: ["ST01-015"], activeDon: 4 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const morley = engine.findCardInZone("south", "character", "OP16-033");
    engine.playCard("ST01-015", "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [morley] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectMixedRestSelection",
      { selectedIds: [engine.leader("south"), morley] },
      "south",
    );
    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === morley)?.rested).toBe(
      true,
    );
    expect(view.players.south.leader.rested).toBe(true);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

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
