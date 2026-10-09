import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-061 Lead Performers", () => {
  test("Animal Kingdom Leader gains Life, then self-trash plays a named King", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-058",
        hand: ["OP17-061", "OP17-064"],
        activeDon: 9,
        deck: ["ST02-002", "ST02-006"],
      },
      {},
    );
    const king = e.findCardInZone("south", "hand", "OP17-064");
    e.asSouth().play("OP17-061");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(6);
    e.asSouth().activateMain("OP17-061");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectPlaySelection", { selectedIds: [king] }, "south");
    expect(e.getView("south").players.south.trash.some((c) => c.cardId === "OP17-061")).toBe(true);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === king)).toBe(
      true,
    );
  });
  test.each(["OP17-065", "OP17-069"])(
    "self-trash plays named %s but excludes an unrelated name",
    (card) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "OP17-058",
          character: ["OP17-061"],
          hand: [card, "OP17-059"],
          activeDon: 1,
        },
        {},
      );
      const target = e.findCardInZone("south", "hand", card);
      const unrelated = e.findCardInZone("south", "hand", "OP17-059");
      e.asSouth().activateMain("OP17-061");
      e.asSouth().acceptOptional();
      const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
      if (step.kind !== "selectEntity") throw new Error("Expected named Character selection");
      expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([target]);
      expect(step.candidates.some((candidate) => candidate.ref.id === unrelated)).toBe(false);
      e.resolveDecision("effectPlaySelection", { selectedIds: [target] }, "south");
      e.asSouth().declineOptional();
      const view = e.getView("south");
      expect(view.players.south.characters.some((c) => c?.instanceId === target)).toBe(true);
      expect(view.players.south.trash.some((c) => c.cardId === "OP17-061")).toBe(true);
      expect(view.players.south.hand.map((c) => c.instanceId)).toEqual([unrelated]);
      expect(view.prompts).toHaveLength(0);
    },
  );
  test.each(["decline", "zero", "wrongLeader"])(
    "On Play %s preserves Life with the printed cost result",
    (mode) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: mode === "wrongLeader" ? "OP01-001" : "OP17-058",
          hand: ["OP17-061"],
          activeDon: 9,
          donDeckCount: 1,
          deck: ["ST02-002", "ST02-006"],
        },
        {},
      );
      const before = e.getView("south").players.south;
      e.asSouth().play("OP17-061");
      if (mode === "decline") e.asSouth().declineOptional();
      else {
        e.asSouth().acceptOptional();
        if (mode === "zero")
          e.resolveDecision("effectAddToLifeFromDeck", { optionId: "0" }, "south");
      }
      const after = e.getView("south");
      expect(after.players.south.restedDon).toBe(mode === "decline" ? 9 : 8);
      expect(after.players.south.donDeckCount).toBe(
        before.donDeckCount + (mode === "decline" ? 0 : 1),
      );
      expect(after.players.south.lifeCount).toBe(before.lifeCount);
      expect(after.players.south.deckCount).toBe(before.deckCount);
      expect(after.prompts).toHaveLength(0);
    },
  );
});
