import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST31-002 Jinbe", () => {
  test.each(["ST01-006", "ST14-017"])(
    "plays a cost-one Straw Hat card %s after drawing",
    (card) => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST01-001",
        hand: ["ST31-002", "ST01-011", "ST02-012"],
        activeDon: 5,
        deck: [card, "ST02-002", "ST02-006"],
      });
      const chosen = e.findCardInZone("south", "deck", card);
      e.asSouth().play("ST31-002");
      const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("play");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([chosen]);
      e.asSouth().choosePlay(chosen);
      const v = e.getView("south").players.south;
      expect(
        card === "ST14-017"
          ? v.stage?.instanceId
          : v.characters.find((c) => c?.cardId === card)?.instanceId,
      ).toBe(chosen);
      expect(v.deckCount).toBe(card === "ST14-017" ? 1 : 2);
    },
  );
  test("declines the optional play", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST31-002", "ST01-006"],
      activeDon: 5,
      deck: ["ST02-002", "ST02-006"],
    });
    e.asSouth().play("ST31-002");
    e.asSouth().chooseNoPlay();
    expect(e.getView("south").players.south.handCount).toBe(2);
  });
  test("blocks an attack on the Leader", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST31-002"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    const jinbe = e.findCardInZone("south", "character", "ST31-002");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(jinbe);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === jinbe)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.south.lifeCount).toBe(4);
  });
});
