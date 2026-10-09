import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-016 To Never Doubt That Is Power", () => {
  test.each(["leader", "character"])(
    "only the physical %s receiving DON!! becomes unblockable",
    (recipient) => {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: "OP12-001",
          character: ["OP13-066", "EB01-005"],
          hand: ["OP12-016"],
          activeDon: 2,
        },
        { character: ["ST01-006"] },
      );
      const leader = engine.leader("south");
      const character = engine.findCardInZone("south", "character", "OP13-066");
      const chosen = recipient === "leader" ? leader : character;
      const other = recipient === "leader" ? character : leader;
      engine.playCard("OP12-016");
      engine.asSouth().acceptOptional();
      const cost = engine.pendingDecision("effectCostGiveDon", "south").steps[0];
      if (cost?.kind !== "payCost") throw new Error("Expected Rayleigh recipient choice.");
      expect(
        cost.candidates
          .filter((c) => c.legal)
          .map((c) => c.ref.id)
          .sort(),
      ).toEqual([leader, character].sort());
      engine.resolveDecision("effectCostGiveDon", { selectedIds: [chosen] }, "south");
      expect(engine.getView("south").prompts).toHaveLength(0);
      engine.declareAttack(other, engine.leader("north"), "south");
      engine.pendingDecision("battleBlocker", "north");
      engine.asNorth().chooseBlocker(null);
      const before = engine.getView("south").players.north.lifeCount;
      engine.declareAttack(chosen, engine.leader("north"), "south");
      // No usable Counter remains, so the Counter Step ends automatically.
      expect(engine.getView("south").players.north.lifeCount).toBe(before - 1);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("automatically binds the only Rayleigh recipient and expires after this turn", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP12-001", hand: ["OP12-016"], activeDon: 2 },
      { character: ["ST01-006"] },
    );
    engine.playCard("OP12-016");
    engine.asSouth().acceptOptional();
    expect(engine.getView("south").players.south.leader.attachedDon).toBe(2);
    const before = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(before - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.pendingDecision("battleBlocker", "north");
  });

  test("[Counter] boosts a Character by 2000 during the battle", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP12-016"], character: [{ cardId: "OP13-066", rested: true }], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const rayleighId = engine.findCardInZone("south", "character", "OP13-066");
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    // Benn attacks Rayleigh; the counter boost saves him.
    engine.asNorth().attack("OP16-012", "OP13-066");
    engine.asSouth().chooseCounter("OP12-016");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [rayleighId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      rayleighId,
    );
  });
  test.each(["OP12-001", "OP01-001"])(
    "Counter includes only a named Rayleigh Leader (%s) and any Character",
    (leaderCardId) => {
      const engine = OnePieceTestEngine.create({
        leaderCardId,
        hand: ["OP12-016"],
        character: ["EB01-005"],
      });
      const lifeBefore = engine.getView("south").players.south.lifeCount;
      engine.endTurn("south");
      engine.attachDon(engine.leader("north"), 1, "north");
      engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
      engine.asSouth().chooseCounter("OP12-016");
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
