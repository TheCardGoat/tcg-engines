import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-003 Izo", () => {
  test.each(["OP17-001", "OP01-031", "OP01-001"])(
    "Leader eligibility and rested target filter: %s",
    (leader) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: leader, hand: ["OP17-003"], activeDon: 4 },
        { character: [{ cardId: "EB01-005", rested: true }, "EB01-025"] },
      );
      const target = e.findCardInZone("north", "character", "EB01-005");
      e.playCard("OP17-003");
      if (leader !== "OP01-001") {
        const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
        if (step?.kind !== "selectEntity") throw new Error("Expected rested targets");
        expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
        e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      }
      expect(e.getView("south").players.north.characters[0]?.power).toBe(
        leader === "OP01-001" ? 3000 : -3000,
      );
      const izo = e.findCardInZone("south", "character", "OP17-003");
      e.declareAttack(izo, target);
      expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});
