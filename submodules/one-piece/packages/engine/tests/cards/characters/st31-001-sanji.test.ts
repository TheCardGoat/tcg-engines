import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST31-001 Sanji", () => {
  test("draws before choosing a cost-five Straw Hat and excludes Sanji", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST31-001", "ST31-001", "ST02-006", "ST14-012"],
      activeDon: 5,
      deck: ["ST01-012", "ST02-002"],
    });
    const chosen = e.findCardInZone("south", "deck", "ST01-012");
    e.asSouth().play("ST31-001");
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([chosen]);
    e.asSouth().choosePlay(chosen);
    expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(chosen);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("declines play while keeping the drawn card", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST31-001"],
      activeDon: 5,
      deck: ["ST01-006", "ST02-002"],
    });
    e.asSouth().play("ST31-001");
    e.asSouth().chooseNoPlay();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST01-006"]);
  });
  test.each([1, 2])("new Sanji needs two attached DON for Rush: %i", (amount) => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST31-001"], activeDon: 7, deck: ["ST02-002", "ST02-006"] },
      { life: ["ST02-002", "ST02-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().play("ST31-001");
    const sanji = e.findCardInZone("south", "character", "ST31-001");
    e.asSouth().attachDon(sanji, amount);
    if (amount === 1) {
      expect(
        e.expectFailure({
          type: "declareAttack",
          seat: "south",
          attackerId: sanji,
          targetId: e.leader("north"),
        }).accepted,
      ).toBe(false);
    } else {
      e.asSouth().attack(sanji, e.leader("north"));
      expect(e.getView("north").players.north.lifeCount).toBe(1);
    }
  });
});
