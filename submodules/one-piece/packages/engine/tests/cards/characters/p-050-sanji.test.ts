import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-050 Sanji", () => {
  test.each([
    [0, 3],
    [1, 4],
    [1, 3],
  ])("own-turn power with %i DON and %i hand", (don, hand) => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      character: ["P-050"],
      activeDon: 1,
      hand: Array.from({ length: hand }, () => "ST02-002"),
    });
    const s = e.findCardInZone("south", "character", "P-050");
    if (don) e.asSouth().attachDon(s, 1);
    else e.asSouth().attachDon(e.leader("south"), 1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(
      2000 + don * 1000 + (don && hand === 3 ? 4000 : 0),
    );
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(2000);
  });
  test("hand reduction switches the live own-turn bonus on", () => {
    const e = OnePieceTestEngine.create({
      character: ["P-050"],
      activeDon: 4,
      hand: ["ST02-002", "ST02-006", "ST02-012", "ST02-012"],
    });
    const s = e.findCardInZone("south", "character", "P-050");
    e.asSouth().attachDon(s, 1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(3000);
    e.asSouth().play("ST02-002");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
  });
  test.each([true, false])("Blocker accept=%s does not require DON or low hand", (accept) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["P-050"] },
      { leaderCardId: "ST01-001" },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const s = e.findCardInZone("south", "character", "P-050");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    if (accept) e.asSouth().chooseBlocker(s);
    else e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(accept ? 5 : 4);
    expect(
      e
        .getView("south")
        .players.south.trash.map((c) => c.instanceId)
        .includes(s),
    ).toBe(accept);
  });
});
