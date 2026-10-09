import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("characters/st30-007-portgas-d-ace", () => {
  test("paid Rush permits immediate attack and attack debuff expires", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST30-007"], activeDon: 5 },
      { character: ["ST21-005"] },
    );
    e.playCard("ST30-007");
    e.asSouth().acceptOptional();
    e.asSouth().attack(e.findCardInZone("south", "character", "ST30-007"), e.leader("north"));
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-005"));
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("south").players.south.restedDon).toBe(5);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(4000);
  });
  test("declines optional Rush payment and cannot attack this turn", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST30-007"], activeDon: 5 });
    e.playCard("ST30-007");
    e.asSouth().declineOptional();
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: e.findCardInZone("south", "character", "ST30-007"),
        targetId: e.leader("north"),
      }).reason,
    ).toBeTruthy();
    expect(e.getView("south").players.south.activeDon).toBe(1);
  });
  test("declines optional attack target after normal earlier-turn play", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST30-007", playedOnTurn: 0 }] },
      { character: ["ST21-005"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST30-007"), e.leader("north"));
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(4000);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
});
