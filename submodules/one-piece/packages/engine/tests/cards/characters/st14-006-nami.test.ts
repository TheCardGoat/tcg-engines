import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST14-006 Nami", () => {
  test.each([
    { hand: 6, costCard: "ST09-005", draw: true },
    { hand: 7, costCard: "ST09-005", draw: false },
    { hand: 6, costCard: "ST14-005", draw: false },
  ])("requires both post-play hand and current field cost: %s", ({ hand, costCard, draw }) => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST14-001",
      character: [costCard],
      hand: ["ST14-006", ...Array(hand).fill("ST12-009")],
      activeDon: 4,
      deck: ["ST14-005", "ST12-015"],
    });
    e.attachDon(e.leader("south"), 1);
    e.playCard("ST14-006");
    expect(e.getView("south").players.south.handCount).toBe(hand + (draw ? 1 : 0));
    expect(e.getView("south").players.south.deckCount).toBe(draw ? 1 : 2);
  });
  test("Blocker intercepts a Leader attack", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST14-006"], life: 2 },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST14-006");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().chooseBlocker(id);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
  });
});
