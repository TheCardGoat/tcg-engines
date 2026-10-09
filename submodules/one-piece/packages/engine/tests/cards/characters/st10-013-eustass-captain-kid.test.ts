import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-013-eustass-captain-kid", () => {
  test("On Play pays DON for Leader power through opponent turn; attack can pay again", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST10-013"], activeDon: 7 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST10-013", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    expect(e.getView("south").players.south.restedDon).toBe(6);
    e.endTurn("south");
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    e.endTurn("north");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    e.declareAttack(e.findCardInZone("south", "character", "ST10-013"), e.leader("north"), "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(6000);
  });
  test("declines the optional DON cost on play and attack", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST10-013"], activeDon: 7 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST10-013", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(7);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    e.endTurn("south");
    e.endTurn("north");
    e.declareAttack(e.findCardInZone("south", "character", "ST10-013"), e.leader("north"), "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(9);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});
