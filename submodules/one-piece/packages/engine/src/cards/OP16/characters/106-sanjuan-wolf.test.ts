import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-106 Sanjuan Wolf", () => {
  test("[On K.O.] with a Blackbeard Pirates Leader draws and sets a card's base power to 7000", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-080",
        character: [{ cardId: "OP16-106", rested: true }, "EB01-005"],
        activeDon: 5,
      },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const domaId = engine.findCardInZone("south", "character", "EB01-005");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-106");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the base-power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === domaId)?.power,
    ).toBe(7000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-106", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-106",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test.each(["OP09-081", "OP01-001"])(
    "Life Trigger applies On K.O. only for a Blackbeard Leader (%s)",
    (leaderCardId) => {
      const engine = OnePieceTestEngine.create(
        { leaderCardId, life: ["OP16-106"], deck: ["EB01-005", "EB01-018"] },
        { leaderCardId: "OP01-001", activeDon: 2 },
        { activeSeat: "north" },
      );
      engine.asNorth().attachDon(engine.asNorth().leader(), 2);
      engine.asNorth().attack(engine.asNorth().leader(), engine.asSouth().leader());
      engine.asSouth().activateLifeTrigger();
      if (leaderCardId === "OP09-081") {
        engine.asSouth().chooseTargets(engine.asSouth().leader());
        expect(engine.asSouth().view().players.south.handCount).toBe(1);
        expect(engine.asSouth().view().players.south.leader.power).toBe(7000);
      } else {
        expect(engine.asSouth().view().players.south.handCount).toBe(0);
        expect(engine.asSouth().view().players.south.leader.power).toBe(5000);
      }
      expect(
        engine
          .asSouth()
          .view()
          .players.south.trash.map((card) => card.cardId),
      ).toContain("OP16-106");
    },
  );
});
