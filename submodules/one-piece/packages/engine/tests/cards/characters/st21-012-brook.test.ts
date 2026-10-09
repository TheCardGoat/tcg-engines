import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-012 Brook", () => {
  test.each([1, 2])("attack attaches %s rested DON to Brook for the current battle", (amount) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-012", playedOnTurn: 0 }], restedDon: 2 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST21-012");
    e.asSouth().attack(id, e.leader("north"));
    e.resolveDecision("effectGiveDonCount", { optionId: String(amount) }, "south");
    e.asSouth().chooseTargets(id);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000 + amount * 1000);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("south").players.south.restedDon).toBe(2 - amount);
  });
  test("declines optional attack grant and loses the power comparison", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-012", playedOnTurn: 0 }], restedDon: 2 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST21-012"), e.leader("north"));
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("north").players.north.lifeCount).toBe(4);
    expect(e.getView("south").players.south.restedDon).toBe(2);
  });
  test("Leader can receive the whole grant instead", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-012", playedOnTurn: 0 }], restedDon: 2 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST21-012"), e.leader("north"));
    e.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.attachedDon).toBe(2);
    expect(e.getView("north").players.north.lifeCount).toBe(4);
  });
});
