import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-005 Edward.Newgate", () => {
  test.each(["OP17-001", "OP15-001"])(
    "discounted play and monocolor power duration: %s",
    (leader) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: leader, hand: ["OP17-005"], activeDon: 6 },
        { character: ["OP15-060"] },
      );
      e.playCard("OP17-005");
      expect(e.getView("south").players.south.activeDon).toBe(0);
      expect(e.getView("south").players.south.leader?.power).toBe(
        leader === "OP17-001" ? 8000 : 5000,
      );
      e.endTurn("south");
      expect(e.getView("south").players.south.leader?.power).toBe(
        leader === "OP17-001" ? 8000 : 5000,
      );
      e.endTurn("north");
      expect(e.getView("south").players.south.leader?.power).toBe(5000);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});
