import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-118 Lilith", () => {
  test.each(["OP07-108", "ST07-007"])("plays either eligible branch: %s", (chosenCard) => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP07-097",
      hand: ["P-118", "OP07-108", "ST07-007", "EB01-005", "ST07-010", "OP01-029"],
      activeDon: 6,
    });
    const selected = e.findCardInZone("south", "hand", chosenCard);
    const egghead = e.findCardInZone("south", "hand", "OP07-108");
    const trigger = e.findCardInZone("south", "hand", "ST07-007");
    e.asSouth().play("P-118");
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.map((c) => c.ref.id)).toEqual(expect.arrayContaining([egghead, trigger]));
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "hand", "EB01-005"),
    );
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "hand", "ST07-010"),
    );
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "hand", "OP01-029"),
    );
    e.resolveDecision("effectPlaySelection", { selectedIds: [selected] }, "south");
    expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      selected,
    );
  });
  test("wrong Leader cannot play even a valid Trigger Character", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-118", "ST07-007"], activeDon: 6 });
    e.asSouth().play("P-118");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST07-007"]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
