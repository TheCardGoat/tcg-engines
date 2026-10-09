import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-031 Yasopp", () => {
  test("On Play draws the physical top card and rests cost8 but excludes cost9", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-031"], deck: ["OP17-006", "OP17-002"], activeDon: 5 },
      { character: ["OP17-024", "OP17-047"] },
    );
    const drawn = e.findCardInZone("south", "deck", "OP17-006"),
      target = e.findCardInZone("north", "character", "OP17-024");
    e.playCard("OP17-031");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected rest selection");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([drawn]);
    expect(e.getView("south").players.north.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.north.characters[1]?.rested).toBe(false);
    e.endTurn("south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
  });
  test.each([true, false])(
    "End of Turn includes Allies and excludes other types; accept=%s",
    (accept) => {
      const e = OnePieceTestEngine.create({
        character: [
          "OP17-031",
          { cardId: "OP17-026", rested: true },
          { cardId: "EB01-005", rested: true },
        ],
      });
      const ally = e.findCardInZone("south", "character", "OP17-026"),
        wrong = e.findCardInZone("south", "character", "EB01-005");
      e.endTurn("south");
      const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected reactivation selection");
      expect(step.candidates.map((c) => c.ref.id)).toContain(ally);
      expect(step.candidates.map((c) => c.ref.id)).not.toContain(wrong);
      e.resolveDecision("effectTargetSelection", { selectedIds: accept ? [ally] : [] }, "south");
      expect(
        e.getView("south").players.south.characters.find((c) => c?.instanceId === ally)?.rested,
      ).toBe(!accept);
      expect(
        e.getView("south").players.south.characters.find((c) => c?.instanceId === wrong)?.rested,
      ).toBe(true);
    },
  );
});
