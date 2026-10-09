import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-014 Marco", () => {
  test("may be K.O.'d instead when an opposing effect would remove another Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-014", "EB03-021"] },
      { hand: ["OP16-006"], activeDon: 8 },
    );
    const marcoId = engine.findCardInZone("south", "character", "OP16-014");
    const alvidaId = engine.findCardInZone("south", "character", "EB03-021");

    engine.endTurn("south");
    engine.asNorth().play("OP16-006");
    engine.acceptLeadingOptional("north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [alvidaId] }, "north");

    // Marco's owner confirms the replacement: Marco is K.O.'d, Alvida survives.
    const replacement = engine.pendingDecision("effectKoReplacement", "south").steps[0];
    if (replacement?.kind !== "confirm") throw new Error("Expected the replacement confirm.");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      marcoId,
    );
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      alvidaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the replacement lets the removal resolve normally", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-014", "EB03-021"] },
      { hand: ["OP16-006"], activeDon: 8 },
    );
    const marcoId = engine.findCardInZone("south", "character", "OP16-014");
    const alvidaId = engine.findCardInZone("south", "character", "EB03-021");

    engine.endTurn("south");
    engine.asNorth().play("OP16-006");
    engine.acceptLeadingOptional("north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [alvidaId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");

    // Alvida is South's card: the K.O. sends her to South's trash.
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      alvidaId,
    );
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      marcoId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("On K.O. trashes an exactly-8000 Character to replay the same Marco", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-014", rested: true }], hand: ["OP16-004"] },
      { character: [{ cardId: "OP16-003", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const marcoId = engine.findCardInZone("south", "character", "OP16-014");
    const costId = engine.findCardInZone("south", "hand", "OP16-004");
    const attackerId = engine.findCardInZone("north", "character", "OP16-003");
    engine.declareAttack(attackerId, marcoId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      costId,
    );
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === marcoId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline payable On K.O. revival and retain the 8000-power hand card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-014", rested: true }], hand: ["OP16-004"] },
      { character: [{ cardId: "OP16-003", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const marcoId = engine.findCardInZone("south", "character", "OP16-014");
    const costId = engine.findCardInZone("south", "hand", "OP16-004");
    engine.declareAttack(engine.findCardInZone("north", "character", "OP16-003"), marcoId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      marcoId,
    );
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      costId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
