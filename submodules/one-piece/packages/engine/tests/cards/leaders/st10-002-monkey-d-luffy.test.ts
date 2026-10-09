import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-002-monkey-d-luffy", () => {
  test("adds active DON at zero or eight total, once per turn", () => {
    for (const activeDon of [0, 8]) {
      const e = OnePieceTestEngine.create({ leaderCardId: "ST10-002", activeDon });
      e.activateEffect(e.leader("south"), "activateMain", "south");
      e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
      expect(e.getView("south").players.south.activeDon).toBe(activeDon + 1);
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.leader("south"),
        trigger: "activateMain",
      });
      expect(e.getView("south").prompts).toHaveLength(0);
    }
  });
  test("counts attached DON and declines the up-to addition", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST10-002",
      activeDon: 8,
      donDeckCount: 2,
    });
    e.attachDon(e.leader("south"), 1, "south");
    e.activateEffect(e.leader("south"), "activateMain", "south");
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(7);
    expect(e.getView("south").players.south.donDeckCount).toBe(2);
  });
  test("one through seven total DON does not meet the condition", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "ST10-002", activeDon: 7 });
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    expect(e.getView("south").players.south.activeDon).toBe(7);
  });
});
