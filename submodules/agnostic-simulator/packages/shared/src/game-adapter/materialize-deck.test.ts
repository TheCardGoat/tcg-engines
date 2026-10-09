import { describe, expect, test } from "bun:test";
import { materializeDeckInstances } from "./materialize-deck.js";

describe("deck copy materialization", () => {
  test("preserves mixed printings, owner and section without changing gameplay identity", () => {
    const deck = [
      { cardId: "canonical-card", qty: 2, printingId: "regular", sectionId: "main" },
      { cardId: "canonical-card", qty: 1, printingId: "alternate", sectionId: "side" },
    ];
    const maps = materializeDeckInstances([
      { owner: "alice", deck },
      { owner: "bob", deck },
    ]);
    expect(Object.keys(maps.cardInstances)).toHaveLength(6);
    for (const owner of ["alice", "bob"]) {
      const ids = maps.owners[owner]!;
      expect(ids).toHaveLength(3);
      expect(ids.map((id) => maps.cardInstances[id])).toEqual(Array(3).fill("canonical-card"));
      expect(ids.map((id) => maps.presentation?.printingIdByInstanceId[id])).toEqual([
        "regular",
        "regular",
        "alternate",
      ]);
      expect(ids.map((id) => maps.instanceSections?.[id])).toEqual(["main", "main", "side"]);
    }
    expect(deck[0]?.qty).toBe(2);
  });

  test("does not invent a printing when none was selected", () => {
    const maps = materializeDeckInstances([{ owner: "alice", deck: [{ cardId: "card", qty: 1 }] }]);
    expect(maps).toEqual({
      cardInstances: { "alice-card-0": "card" },
      owners: { alice: ["alice-card-0"] },
    });
  });

  test("rejects malformed counts instead of silently materializing a different deck", () => {
    for (const qty of [-1, 0.5, NaN, Infinity]) {
      expect(() =>
        materializeDeckInstances([{ owner: "alice", deck: [{ cardId: "card", qty }] }]),
      ).toThrow("Invalid deck quantity");
    }
  });

  test("rejects duplicate owners instead of overwriting their earlier cards", () => {
    expect(() =>
      materializeDeckInstances([
        { owner: "alice", deck: [] },
        { owner: "alice", deck: [] },
      ]),
    ).toThrow("Duplicate deck owner");
  });
});
