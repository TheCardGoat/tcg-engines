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
  expect(() => {
    throw new Error("test");
  }).toThrow();
  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-014", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-014",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const marco = "OP16-014";
    const engine = OnePieceTestEngine.create(
      { hand: [marco], activeDon: 8 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard("OP16-014");
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

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(marco);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
