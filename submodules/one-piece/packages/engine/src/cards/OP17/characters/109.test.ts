import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-109 Charlotte Pudding", () => {
  test("pays a Trigger hand card to draw exactly three cards", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["OP17-109", "OP17-107"],
        activeDon: 3,
        deck: ["ST02-002", "ST02-006", "EB01-005", "OP13-013"],
      },
      {},
    );
    e.asSouth().play("OP17-109");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual([
      "ST02-002",
      "ST02-006",
      "EB01-005",
    ]);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-107");
  });
  test.each([true, false])(
    "search selects a Big Mom card=%s and preserves the physical bottom order",
    (select) => {
      let e = OnePieceTestEngine.create(
        {
          life: ["OP17-109", "ST02-002"],
          deck: ["OP17-107", "ST02-002", "OP17-103", "EB01-005", "OP17-112", "ST02-003"],
        },
        {},
        { activeSeat: "north", firstPlayer: "south" },
      );
      const deck = [...e.getState().players.south.deck];
      e.asNorth().attack(e.leader("north"), e.leader("south"));
      e.asSouth().activateLifeTrigger();
      const step = e.pendingDecision("effectSearchSelection", "south").steps[0];
      if (step.kind !== "selectEntity") throw new Error("Expected Big Mom search");
      expect(step.candidates.filter((c) => c.legal).map((c) => c.publicInfo?.cardId)).toEqual([
        "OP17-107",
        "OP17-103",
        "OP17-112",
      ]);
      expect(step.candidates.map((c) => c.ref.id)).not.toContain(deck[5]);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision(
        "effectSearchSelection",
        { selectedIds: select ? [deck[0]!] : [] },
        "south",
      );
      const order = deck.slice(select ? 1 : 0, 5).reverse();
      e.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual(
        select ? [deck[0]] : [],
      );
      // Saved physical order proves the private deck movement without exposing deck faces in views.
      expect(e.getState().players.south.deck).toEqual([deck[5], ...order]);
      expect(
        e.getView("north").logs.some((l) => l.message.includes("reveals Charlotte Daifuku")),
      ).toBe(select);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});
