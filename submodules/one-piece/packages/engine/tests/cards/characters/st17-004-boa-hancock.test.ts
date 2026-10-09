import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST17-004 Boa Hancock", () => {
  test.each(["top", "bottom"])(
    "orders top three at %s before rested DON goes to a Warlord",
    (position) => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "OP01-062",
        hand: ["ST17-004"],
        character: ["ST12-004"],
        deck: ["ST12-009", "ST12-015", "ST12-004", "ST14-005"],
        activeDon: 4,
      });
      const ids = ["ST12-004", "ST12-009", "ST12-015"].map((c) =>
        e.findCardInZone("south", "deck", c),
      );
      e.playCard("ST17-004");
      e.resolveDecision("effectRearrangeDeckOrder", { selectedIds: ids }, "south");
      e.resolveDecision("effectRearrangeDeckPosition", { optionId: position }, "south");
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("DON");
      expect(p.candidates.map((c) => c.ref.id)).toContain(e.leader("south"));
      expect(p.candidates.map((c) => c.ref.id)).not.toContain(
        e.findCardInZone("south", "character", "ST12-004"),
      );
      e.asSouth().chooseTargets(e.leader("south"));
      expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
      expect(e.getView("south").players.south.restedDon).toBe(3);
      // Hidden deck order has no public view array.
      const deck = e.getState().players.south.deck;
      expect(position === "top" ? deck.slice(0, 3) : deck.slice(-3)).toEqual(ids);
    },
  );
  test("declines optional DON after completing private reorder", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST17-004"],
      deck: ["ST12-009", "ST12-015", "ST12-004", "ST14-005"],
      activeDon: 4,
    });
    e.playCard("ST17-004");
    const p = e.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    if (p?.kind !== "orderItems") throw Error("order");
    e.resolveDecision(
      "effectRearrangeDeckOrder",
      { selectedIds: p.candidates.map((c) => c.ref.id) },
      "south",
    );
    e.resolveDecision("effectRearrangeDeckPosition", { optionId: "top" }, "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(4);
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(0);
  });
  test("Blocker intercepts and survives weaker Leader attack", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST17-004"], life: 2 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST17-004"));
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
});
