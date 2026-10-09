import { describe, expect, test } from "vite-plus/test";
import { eb01Sanji014, eb02MonkeyDLuffy010 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-010 Monkey.D.Luffy", () => {
  test("returns chosen DON, reactivates up to two, and keeps +1000 through the opponent turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb02MonkeyDLuffy010,
      character: [eb01Sanji014],
      activeDon: 1,
      restedDon: 3,
    });
    const leaderId = engine.leader("south");

    engine.activateEffect(leaderId, "activateMain", "south");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "rested-don:0"] },
      "south",
    );
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    let view = engine.getView("south").players.south;
    expect(view).toMatchObject({ activeDon: 2, restedDon: 0 });
    expect(view.leader.power).toBe(6000);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: leaderId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    engine.endTurn("north");
    view = engine.getView("south").players.south;
    expect(view.leader.power).toBe(5000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test.each(["empty", "other trait"])(
    "pays DON!! but does nothing with %s Characters (FAQ Q860)",
    (field) => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: eb02MonkeyDLuffy010,
        character: field === "empty" ? [] : ["EB01-005"],
        activeDon: 1,
        restedDon: 3,
      });
      const before = engine.getView("south").players.south;
      engine.activateEffect(engine.leader("south"), "activateMain", "south");
      engine.resolveDecision(
        "effectCostReturnDon",
        { selectedIds: ["active-don:0", "rested-don:0"] },
        "south",
      );
      const after = engine.getView("south").players.south;
      expect(after).toMatchObject({
        activeDon: 0,
        restedDon: 2,
        donDeckCount: before.donDeckCount + 2,
      });
      expect(after.leader.power).toBe(5000);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb02MonkeyDLuffy010,
      character: [eb01Sanji014],
      activeDon: 1,
      restedDon: 3,
    });
    const leaderId = engine.leader("south");

    engine.activateEffect(leaderId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("choosing zero DON reactivation still grants the following Leader bonus", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb02MonkeyDLuffy010,
      character: [eb01Sanji014],
      restedDon: 4,
    });
    engine.asSouth().activateMain(engine.leader("south"));
    engine.asSouth().acceptOptional();
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 2,
      leader: { power: 6000 },
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
