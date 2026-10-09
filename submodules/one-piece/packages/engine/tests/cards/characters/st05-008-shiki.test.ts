import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st05Shiki008, prb01Kaido003 } from "@tcg/op-cards";
describe("ST05-008 Shiki", () => {
  test.each([6, 7])(
    "battle immunity counts attached DON, cost-area count=%s plus one attached",
    (activeDon) => {
      const e = OnePieceTestEngine.create(
        { character: [{ card: st05Shiki008, rested: true, attachedDon: 1 }], activeDon },
        { character: [{ card: prb01Kaido003, playedOnTurn: 0 }] },
        { firstPlayer: "south", activeSeat: "north" },
      );
      const shiki = e.findCardInZone("south", "character", "ST05-008");
      e.asNorth().attack(e.findCardInZone("north", "character", "ST04-003"), shiki);
      expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === shiki)).toBe(
        activeDon === 7,
      );
      expect(e.getView("south").players.south.trash.some((c) => c.instanceId === shiki)).toBe(
        activeDon === 6,
      );
    },
  );
  test("eight DON does not prevent effect KO", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST05-008"], activeDon: 8 },
      { hand: ["ST04-015"], activeDon: 6 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shiki = e.findCardInZone("south", "character", "ST05-008");
    e.asNorth().play("ST04-015");
    e.asNorth().chooseTargets(shiki);
    e.asNorth().chooseAddDon(0);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(shiki);
  });
});
