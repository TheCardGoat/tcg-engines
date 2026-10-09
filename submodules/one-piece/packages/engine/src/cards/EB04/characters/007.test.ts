import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-007 Roronoa Zoro", () => {
  test("On Play gives the Leader +2000 through the opponent's next End Phase", () => {
    const engine = OnePieceTestEngine.create({ hand: ["EB04-007"], activeDon: 7 });
    engine.playCard("EB04-007");
    expect(engine.getView("south").players.south.leader?.power).toBe(7000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader?.power).toBe(7000);
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader?.power).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("grants Rush: Character against an 8000-power Character, but cannot attack the Leader", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-007"], activeDon: 7 },
      { character: [{ cardId: "EB04-003", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard("EB04-007");
    const zoro = engine.findCardInZone("south", "character", "EB04-007");
    const target = engine.findCardInZone("north", "character", "EB04-003");
    engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: zoro,
      targetId: target,
    });
    engine.activateEffect(zoro, "activateMain", "south");
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: zoro,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: zoro,
      targetId: engine.leader("north"),
    });
    engine.declareAttack(zoro, target, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      target,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not gain Rush: Character when the opponent's highest power is 7000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-007"], activeDon: 7 },
      { character: [{ cardId: "EB04-016", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard("EB04-007");
    const zoro = engine.findCardInZone("south", "character", "EB04-007");
    const target = engine.findCardInZone("north", "character", "EB04-016");
    engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: zoro,
      trigger: "activateMain",
    });
    engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: zoro,
      targetId: target,
    });
    expect(
      engine.getView("south").players.north.characters.some((card) => card?.instanceId === target),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
