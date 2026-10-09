import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-014 Monkey.D.Luffy", () => {
  test.each(["leader", "character"])(
    "Rush allows immediate attack and gives DON to %s",
    (recipient) => {
      const e = OnePieceTestEngine.create(
        { hand: ["ST21-014"], activeDon: 5 },
        {},
        { firstPlayer: "north", activeSeat: "south" },
      );
      e.playCard("ST21-014");
      const id = e.findCardInZone("south", "character", "ST21-014");
      e.asSouth().attack(id, e.leader("north"));
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      e.asSouth().chooseTargets(recipient === "leader" ? e.leader("south") : id);
      expect(e.getView("north").players.north.lifeCount).toBe(3);
      expect(e.getView("south").players.south.restedDon).toBe(4);
      expect(
        recipient === "leader"
          ? e.getView("south").players.south.leader.attachedDon
          : e.getView("south").players.south.characters[0]?.attachedDon,
      ).toBe(1);
    },
  );
  test("declines optional attack grant while Rush battle still deals damage", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST21-014"], activeDon: 5 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST21-014");
    e.asSouth().attack(e.findCardInZone("south", "character", "ST21-014"), e.leader("north"));
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(5);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
});
