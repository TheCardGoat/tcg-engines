import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-103 Van Augur", () => {
  test("[On K.O.] with a Blackbeard Pirates Leader draws and gives -3000 power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-080", character: [{ cardId: "OP16-103", rested: true }], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const augurId = engine.findCardInZone("south", "character", "OP16-103");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-103");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power target.");
    const leaderId = engine.getView("south").players.north.leader!.instanceId!;
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    const north = engine.getView("south").players.north;
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      augurId,
    );
    // 5000 base + 2000 from Newgate's your-turn buff - 3000 from Van Augur.
    expect(north.leader?.power).toBe(4000);
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-103", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-103",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test.each(["OP09-081", "OP01-001"])(
    "Life Trigger preserves the Blackbeard Leader condition (%s)",
    (leaderCardId) => {
      const engine = OnePieceTestEngine.create(
        { leaderCardId, life: ["OP16-103"], deck: ["EB01-005", "EB01-018"] },
        { leaderCardId: "OP01-001", activeDon: 2 },
        { activeSeat: "north" },
      );
      engine.asNorth().attachDon(engine.asNorth().leader(), 2);
      engine.asNorth().attack(engine.asNorth().leader(), engine.asSouth().leader());
      const powerBefore = engine.asSouth().view().players.north.leader.power;
      if (powerBefore === null) throw new Error("Expected a visible opposing Leader power");
      engine.asSouth().activateLifeTrigger();
      if (leaderCardId === "OP09-081") {
        engine.asSouth().chooseTargets(engine.asNorth().leader());
        expect(engine.asSouth().view().players.south.handCount).toBe(1);
        expect(engine.asSouth().view().players.north.leader.power).toBe(powerBefore - 3000);
      } else {
        expect(engine.asSouth().view().players.south.handCount).toBe(0);
        expect(engine.asSouth().view().players.north.leader.power).toBe(powerBefore);
      }
      expect(
        engine
          .asSouth()
          .view()
          .players.south.trash.map((card) => card.cardId),
      ).toContain("OP16-103");
    },
  );
});
