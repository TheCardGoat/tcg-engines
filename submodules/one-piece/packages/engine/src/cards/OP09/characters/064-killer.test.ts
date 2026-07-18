import { describe, expect, test } from "vite-plus/test";
import { op09Killer064, op10EustassCaptainKid099 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-064 Killer", () => {
  test("may return one DON!! to set an included Kid Pirates Leader active", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10EustassCaptainKid099,
        hand: [op09Killer064],
        activeDon: op09Killer064.cost + 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const leaderId = engine.leader("south");
    engine.declareAttack(leaderId, engine.leader("north"), "south");
    const before = engine.getView("south").players.south;

    engine.playCard(op09Killer064, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const donCost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(donCost?.kind).toBe("payCost");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Killer's Leader choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(leaderId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader?.rested).toBe(false);
    expect(view.players.south.donDeckCount).toBe(before.donDeckCount + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning DON!! or setting its Leader active", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10EustassCaptainKid099,
        hand: [op09Killer064],
        activeDon: op09Killer064.cost + 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.playCard(op09Killer064, "south");
    const before = engine.getView("south").players.south;

    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader?.rested).toBe(true);
    expect(view.players.south.donDeckCount).toBe(before.donDeckCount);
    expect(view.prompts).toHaveLength(0);
  });
});
