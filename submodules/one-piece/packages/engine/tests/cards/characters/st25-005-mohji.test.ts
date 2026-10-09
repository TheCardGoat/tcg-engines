import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST25-005 Mohji", () => {
  test.each([
    { leader: "OP09-042", hand: 3, draw: true },
    { leader: "OP09-042", hand: 4, draw: false },
    { leader: "ST01-001", hand: 3, draw: false },
  ])("KO draw checks Leader and hand boundary $leader/$hand", ({ leader, hand, draw }) => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: leader,
        character: [{ cardId: "ST25-005", rested: true }],
        hand: Array(hand).fill("ST01-006"),
        deck: ["ST02-002", "ST02-012"],
      },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(
      e.findCardInZone("north", "character", "ST02-006"),
      e.findCardInZone("south", "character", "ST25-005"),
    );
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("south").players.south.handCount).toBe(hand + (draw ? 1 : 0));
    expect(e.getView("south").players.south.deckCount).toBe(draw ? 1 : 2);
  });
  test("conditional Blocker at two base-cost-five intercepts and is KO", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST25-005", "ST22-010", "ST22-010"], life: 2 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    const m = e.findCardInZone("south", "character", "ST25-005");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(5);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(m);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(m);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
  });
  test("declines Blocker at two qualifying Characters", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST25-005", "ST22-010", "ST22-010"], life: 2 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
  });
  test("one qualifying Character grants neither cost nor Blocker", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST25-005", "ST22-010"], life: 2 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(4);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
