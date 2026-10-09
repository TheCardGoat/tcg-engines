import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-009-jean-bart", () => {
  test("On Play pays one additional DON to add one active DON", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST10-009"], activeDon: 5, donDeckCount: 5 });
    e.playCard("ST10-009", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(5);
    expect(e.getView("south").players.south.donDeckCount).toBe(4);
  });
  test("declines the optional On Play DON cost", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST10-009"], activeDon: 5, donDeckCount: 5 });
    e.playCard("ST10-009", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(4);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
