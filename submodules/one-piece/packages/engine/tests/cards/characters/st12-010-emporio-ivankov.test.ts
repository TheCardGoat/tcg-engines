import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
// Raw deck IDs check hidden ordering; the public view exposes only deck count.
describe("ST12-010 Emporio.Ivankov", () => {
  test("plays only the revealed exact-cost-two Character, not a hand card", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST12-010", "ST12-015"],
      deck: ["ST12-015", "ST12-004", "ST12-009"],
      activeDon: 3,
    });
    const id = e.findCardInZone("south", "deck", "ST12-015");
    e.playCard("ST12-010");
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.asSouth().choosePlay(id);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(false);
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.deckCount).toBe(2);
  });
  test.each(["top", "bottom"])(
    "declines optional revealed play then moves remainder to %s",
    (position) => {
      const e = OnePieceTestEngine.create({
        hand: ["ST12-010"],
        deck: ["ST12-015", "ST12-004", "ST12-009"],
        activeDon: 3,
      });
      const id = e.findCardInZone("south", "deck", "ST12-015");
      e.playCard("ST12-010");
      e.asSouth().chooseNoPlay();
      e.resolveDecision("effectRevealedDeckPosition", { optionId: position }, "south");
      expect(e.getState().players.south.deck[position === "top" ? 0 : 2]).toBe(id);
      expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    },
  );
  test.each(["ST12-004", "ST12-016"])("does not play revealed wrong cost/category %s", (card) => {
    const e = OnePieceTestEngine.create({
      hand: ["ST12-010"],
      deck: [card, "ST12-009"],
      activeDon: 3,
    });
    e.playCard("ST12-010");
    e.resolveDecision("effectRevealedDeckPosition", { optionId: "bottom" }, "south");
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").players.south.deckCount).toBe(2);
  });
  test.each([6, 7])("attack draw uses six-card hand limit at %s", (hand) => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "ST12-010", playedOnTurn: 0 }],
        hand,
        deck: ["ST12-009", "ST12-004"],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-010"), e.leader("north"));
    expect(e.getView("south").players.south.handCount).toBe(7);
    expect(e.getView("south").players.south.deckCount).toBe(hand === 6 ? 1 : 2);
  });

  test("repeat attack does not draw twice in one turn", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST12-001",
        character: [{ cardId: "ST12-010", playedOnTurn: 0, attachedDon: 1 }, "ST12-015"],
        hand: 3,
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST12-010"),
      paid = e.findCardInZone("south", "character", "ST12-015");
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(id, e.leader("north"));
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostReturnCharacter", { selectedIds: [paid] }, "south");
    e.asSouth().chooseTargets(id);
    // No usable Counter remains, so the Counter Step ends automatically.
    e.asSouth().attack(id, e.leader("north"));
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.handCount).toBe(5);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });

  test("declines optional revealed Character while retaining hand and field", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST12-010", "ST12-015"],
      deck: ["ST12-015", "ST12-004"],
      activeDon: 3,
    });
    e.playCard("ST12-010");
    e.asSouth().chooseNoPlay();
    e.resolveDecision("effectRevealedDeckPosition", { optionId: "top" }, "south");
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").players.south.deckCount).toBe(2);
  });
});
