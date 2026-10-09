import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-057 Captain Buggy's Our Savior!", () => {
  test("[Counter] with 2+ [Prisoner of Impel Down] cards saves the Leader with +4000", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-057"],
        character: ["OP16-042", "OP16-042"],
        activeDon: 5,
      },
      { character: ["OP16-004"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-004", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP16-057");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.getView("south").players.south.leader!.instanceId!] },
      "south",
    );

    // 5000 + 4000 >= 8000: saved.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("with fewer than 2 [Prisoner] cards the counter does not save", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-057"], character: ["OP16-042"], activeDon: 5 },
      { character: ["OP16-004"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-004", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP16-057");
    // The gate leaves the +4000 unapplied: the Leader takes the damage.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
  });

  test("Life Trigger draws two cards and trashes one without the Counter's condition", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", life: ["OP16-057"], deck: ["EB01-005", "EB01-025", "EB01-018"] },
      { leaderCardId: "OP01-001", activeDon: 2 },
      { activeSeat: "north" },
    );
    engine.asNorth().attachDon(engine.asNorth().leader(), 2);
    engine.asNorth().attack(engine.asNorth().leader(), engine.asSouth().leader());
    engine.asSouth().activateLifeTrigger();
    expect(engine.asSouth().view().players.south.handCount).toBe(2);
    engine.asSouth().trashFromHand("EB01-005");
    const view = engine.asSouth().view();
    expect(view.players.south.hand.map((card) => card.cardId)).toEqual(["EB01-025"]);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash.map((card) => card.cardId)).toContain("OP16-057");
  });
});
