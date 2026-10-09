import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-019 Color of Arms Haki", () => {
  test("[Main] give-DON cost boosts a card +1000 in addition to its attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP13-066", rested: true }], hand: ["OP12-019"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const rayleighId = engine.findCardInZone("south", "character", "OP13-066");
    const rayleighBase =
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === rayleighId)
        ?.power ?? 0;

    engine.playCard("OP12-019");
    engine.acceptLeadingOptional("south");
    // The only named recipient pays automatically.
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === rayleighId)
        ?.attachedDon,
    ).toBe(1);
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [rayleighId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === rayleighId)
        ?.power,
    ).toBe(rayleighBase + 2000);
  });

  test("[Counter] declined boosts nothing", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP13-066", rested: true }], hand: ["OP12-019"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const rayleighId = engine.findCardInZone("south", "character", "OP13-066");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", rayleighId);
    engine.asSouth().chooseCounter("OP12-019");
    engine.acceptLeadingOptional("south");
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
      rayleighId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each(["OP12-001", "OP01-001"])(
    "Counter includes only a named Rayleigh Leader (%s) and any Character",
    (leaderCardId) => {
      const engine = OnePieceTestEngine.create({
        leaderCardId,
        hand: ["OP12-019"],
        character: ["EB01-005"],
      });
      const lifeBefore = engine.getView("south").players.south.lifeCount;
      engine.endTurn("south");
      engine.attachDon(engine.leader("north"), 1, "north");
      engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
      engine.asSouth().chooseCounter("OP12-019");
      const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
      if (choice?.kind !== "selectEntity") throw new Error("Expected Counter targets.");
      const character = engine.findCardInZone("south", "character", "EB01-005");
      const expected =
        leaderCardId === "OP12-001" ? [engine.leader("south"), character] : [character];
      expect(
        choice.candidates
          .filter((c) => c.legal)
          .map((c) => c.ref.id)
          .sort(),
      ).toEqual(expected.sort());
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: [leaderCardId === "OP12-001" ? engine.leader("south") : character] },
        "south",
      );
      expect(engine.getView("south").players.south.lifeCount).toBe(
        lifeBefore - (leaderCardId === "OP12-001" ? 0 : 1),
      );
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );
});
