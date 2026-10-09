import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-012-bepo", () => {
  test("On Play and When Attacking each add rested DON while behind", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST10-012"], activeDon: 4 },
      { activeDon: 8 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST10-012", "south");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(5);
    e.endTurn("south");
    e.endTurn("north");
    const id = e.findCardInZone("south", "character", "ST10-012");
    e.declareAttack(id, e.leader("north"), "south");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.activeDon).toBe(7);
  });
  test("declines the up-to addition, and equal total DON does not qualify", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST10-012"], activeDon: 4 }, { activeDon: 5 });
    e.playCard("ST10-012", "south");
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(4);
    const f = OnePieceTestEngine.create({ hand: ["ST10-012"], activeDon: 4 }, { activeDon: 4 });
    f.playCard("ST10-012", "south");
    expect(f.getView("south").prompts).toHaveLength(0);
    expect(f.getView("south").players.south.restedDon).toBe(4);
  });
});
