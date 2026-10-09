import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("OP17 FAQ action clauses", () => {
  test.each(["top", "bottom"])(
    "Streusen orders both cards together at %s before drawing (Q1388)",
    (position) => {
      const e = OnePieceTestEngine.create(
        {
          hand: ["OP17-050"],
          activeDon: 1,
          deck: ["EB01-005", "EB01-025", "OP15-107", "OP16-004"],
        },
        {},
      );
      e.asSouth().play("OP17-050");
      expect(e.getView("south").players.south.hand).toHaveLength(0);
      const step = e.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
      if (step?.kind !== "orderItems") throw new Error("Expected deck order");
      expect(step.candidates).toHaveLength(2);
      const order = step.candidates.map((c) => c.ref.id).reverse();
      e.resolveDecision("effectRearrangeDeckOrder", { selectedIds: order }, "south");
      e.resolveDecision("effectRearrangeDeckPosition", { optionId: position }, "south");
      expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual([
        position === "top" ? "EB01-025" : "OP15-107",
      ]);
      // Inspect hidden deck only to prove the selected order was preserved as one group.
      expect(
        position === "top"
          ? e.getState().players.south.deck[0]
          : e.getState().players.south.deck.slice(-2),
      ).toEqual(position === "top" ? order[1] : order);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
  test("Cracker's Life Trigger plays it without opponent-turn On Play (Q1409)", () => {
    const e = OnePieceTestEngine.create(
      {},
      { leaderCardId: "OP03-077", life: ["OP17-104"], hand: [], activeDon: 2 },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    const v = e.getView("north");
    expect(v.players.north.characters.some((c) => c?.cardId === "OP17-104")).toBe(true);
    expect(v.players.north.activeDon).toBe(2);
    expect(v.players.north.lifeCount).toBe(0);
    expect(v.prompts).toHaveLength(0);
  });
});
