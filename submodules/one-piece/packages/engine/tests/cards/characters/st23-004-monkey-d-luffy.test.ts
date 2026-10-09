import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st23-004-monkey-d-luffy", () => {
  test("rests DON and itself to reduce opposing power for this turn", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST23-004"], activeDon: 1 },
      { character: ["ST21-005"] },
    );
    e.activateEffect(e.findCardInZone("south", "character", "ST23-004"), "activateMain");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-005"));
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(4000);
  });
  test("declines optional combined payment without resting anything", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST23-004"], activeDon: 1 },
      { character: ["ST21-005"] },
    );
    e.activateEffect(e.findCardInZone("south", "character", "ST23-004"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.activeDon).toBe(1);
  });
  test.each([true, false])("unpayable self or DON restriction rested=%s", (rested) => {
    const e = OnePieceTestEngine.create({
      character: [{ cardId: "ST23-004", rested }],
      activeDon: rested ? 1 : 0,
    });
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.findCardInZone("south", "character", "ST23-004"),
        trigger: "activateMain",
      }).reason,
    ).toBeTruthy();
  });
  test("real Law reactivation permits a second activation because no OPT is printed", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST23-004"], hand: ["ST02-009"], activeDon: 7 },
      { character: ["ST21-005"] },
    );
    const luffy = e.findCardInZone("south", "character", "ST23-004");
    const target = e.findCardInZone("north", "character", "ST21-005");
    e.activateEffect(luffy, "activateMain");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(target);
    e.playCard("ST02-009");
    e.asSouth().chooseTargets(luffy);
    e.activateEffect(luffy, "activateMain");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(2000);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
});
