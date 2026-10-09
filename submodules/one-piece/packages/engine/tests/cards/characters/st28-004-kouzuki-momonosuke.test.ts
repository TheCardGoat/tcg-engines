import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st28-004-kouzuki-momonosuke", () => {
  test("paid attached DON grants Rush and power on the played turn", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST28-004"], activeDon: 10, life: 2 }, {});
    e.asSouth().attachDon(e.leader("south"), 2);
    e.playCard("ST28-004");
    const m = e.findCardInZone("south", "character", "ST28-004");
    e.activateEffect(m, "activateMain");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.restedDon).toBe(8);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    e.asSouth().attack(m, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    e.asSouth().attachDon(e.leader("south"), 2);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(2);
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: m,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("declines optional attached DON payment with both DON available", () => {
    const e = OnePieceTestEngine.create({ character: ["ST28-004"], activeDon: 2, life: 3 });
    e.asSouth().attachDon(e.leader("south"), 2);
    e.activateEffect(e.findCardInZone("south", "character", "ST28-004"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.leader.attachedDon).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    expect(e.getView("south").players.south.restedDon).toBe(0);
  });
  test("one attached DON and spare cost-area DON cannot pay", () => {
    const e = OnePieceTestEngine.create({
      character: [{ cardId: "ST28-004", attachedDon: 1 }],
      activeDon: 3,
      restedDon: 2,
      life: 3,
    });
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.findCardInZone("south", "character", "ST28-004"),
        trigger: "activateMain",
      }).reason,
    ).toBeTruthy();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(1);
  });
});
