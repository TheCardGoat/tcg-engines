import { describe, expect, test } from "vite-plus/test";
import { op02Hydra090, op02Magellan071 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-071 Magellan", () => {
  test("gains 1000 power after only the first DON!! return during its turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02Magellan071,
      hand: [op02Hydra090, op02Hydra090],
      activeDon: 4,
    });
    const leaderId = engine.leader("south");
    const powerBefore = engine.getView("south").players.south.leader.power;
    expect(powerBefore).toBe(5000);

    engine.playCard(op02Hydra090);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(6000);

    engine.playCard(op02Hydra090);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader).toMatchObject({
      instanceId: leaderId,
      power: 6000,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
