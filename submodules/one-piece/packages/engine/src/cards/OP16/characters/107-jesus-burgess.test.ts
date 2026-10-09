import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-107 Jesus Burgess", () => {
  test("[On K.O.] adds the top card of the opponent's Life to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-107", rested: true }] },
      { character: ["OP16-003"], activeDon: 5, life: ["OP13-013", "EB01-005", "OP16-004"] },
    );
    const burgessId = engine.findCardInZone("south", "character", "OP16-107");
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-107");

    const north = engine.getView("south").players.north;
    expect(north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      burgessId,
    );
    // The removed Life card reached the owner's hand (verify via game state).
    engine.findCardInZone("north", "hand", "OP13-013");
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-107", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-107",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger pays a hand trash and plays the same physical Burgess", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", life: ["OP16-107"], hand: ["OP15-097", "OP16-039"] },
      { leaderCardId: "OP01-001", activeDon: 2 },
      { activeSeat: "north" },
    );
    engine.asNorth().attachDon(engine.asNorth().leader(), 2);
    const burgessId = engine.asSouth().findInZone("life", "OP16-107");
    engine.asNorth().attack(engine.asNorth().leader(), engine.asSouth().leader());
    engine.asSouth().activateLifeTrigger();
    engine.asSouth().acceptOptional();
    engine
      .asSouth()
      .choose("effectCostTrashFromHand", [engine.asSouth().findInZone("hand", "OP15-097")]);
    const burgess = engine
      .asSouth()
      .view()
      .players.south.characters.find((card) => card?.cardId === "OP16-107");
    expect(burgess?.instanceId).toBe(burgessId);
    expect(
      engine
        .asSouth()
        .view()
        .players.south.hand.map((card) => card.cardId),
    ).toEqual(["OP16-039"]);
    expect(
      engine
        .asSouth()
        .view()
        .players.south.trash.map((card) => card.cardId),
    ).toContain("OP15-097");
    expect(
      engine
        .asSouth()
        .view()
        .players.south.trash.map((card) => card.cardId),
    ).not.toContain("OP16-107");
  });

  test("declining the Trigger payment keeps the hand card and trashes Burgess", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", life: ["OP16-107"], hand: ["OP15-097"] },
      { leaderCardId: "OP01-001", activeDon: 2 },
      { activeSeat: "north" },
    );
    engine.asNorth().attachDon(engine.asNorth().leader(), 2);
    engine.asNorth().attack(engine.asNorth().leader(), engine.asSouth().leader());
    // No usable Counter remains, so the Counter Step ends automatically.
    engine.asSouth().activateLifeTrigger();
    engine.asSouth().declineOptional();
    expect(
      engine
        .asSouth()
        .view()
        .players.south.hand.map((card) => card.cardId),
    ).toEqual(["OP15-097"]);
    expect(
      engine
        .asSouth()
        .view()
        .players.south.characters.some((card) => card?.cardId === "OP16-107"),
    ).toBe(false);
    expect(
      engine
        .asSouth()
        .view()
        .players.south.trash.map((card) => card.cardId),
    ).toContain("OP16-107");
  });
});
