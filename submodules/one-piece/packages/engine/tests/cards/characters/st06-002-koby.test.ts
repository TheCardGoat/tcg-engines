import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST06-002 Koby", () => {
  test("discards one card to KO a zero-cost Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST06-008", "ST06-002", "ST02-002"], activeDon: 4 },
      { character: ["ST02-002", "ST02-006"] },
    );
    const target = e.findCardInZone("north", "character", "ST02-002");
    e.playCard("ST06-008", "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    e.playCard("ST06-002", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("KO choice");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST02-002");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
  });
  test("decline preserves hand and both fields", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST06-002", "ST02-002"], activeDon: 1 },
      { character: ["ST02-006"] },
    );
    e.playCard("ST06-002", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
  });
  test("plays with no remaining hand without activating its cost", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST06-002"], activeDon: 1 });
    e.playCard("ST06-002", "south");
    expect(e.getView("south").players.south.characters.some((c) => c?.cardId === "ST06-002")).toBe(
      true,
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
