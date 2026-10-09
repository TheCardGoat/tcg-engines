import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st27-004-sanjuan-wolf", () => {
  test.each([0, 3, 4, 7, 8])(
    "Blocker exists independently of trash count %s while cost scales by full groups",
    (count) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: "OP09-081", character: ["ST27-004"], trash: Array(count).fill("ST21-005") },
        { character: [{ cardId: "ST15-002", playedOnTurn: 0 }] },
        { activeSeat: "north", firstPlayer: "south" },
      );
      expect(e.getView("south").players.south.characters[0]?.cost).toBe(4 + Math.floor(count / 4));
      e.asNorth().attack(e.findCardInZone("north", "character", "ST15-002"), e.leader("south"));
      e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST27-004"));
      expect(e.getView("south").players.south.lifeCount).toBe(5);
      expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    },
  );
  test("OnPlay discard crosses a trash group boundary", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP16-080",
      hand: ["ST27-004", "ST21-005", "ST21-006"],
      trash: ["ST21-008", "ST21-008", "ST21-008"],
      activeDon: 4,
    });
    e.playCard("ST27-004");
    e.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [e.findCardInZone("south", "hand", "ST21-005")] },
      "south",
    );
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(5);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("wrong Leader receives neither cost bonus nor Blocker", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST27-004"], trash: Array(8).fill("ST21-005") },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(4);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
  test("declines optional Blocker at zero trash", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP09-081", character: ["ST27-004"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
