import { describe, expect, test } from "vite-plus/test";
import { eb01Blueno017, eb01MountainGod018, op01Pacifista075, op01Shanks120 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-120 Shanks", () => {
  test("uses Rush and prevents only power-2000-or-less Blockers during its attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01Shanks120],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: op01Shanks120.cost,
      },
      {
        character: [eb01Blueno017, op01Pacifista075],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lowPowerBlockerId = engine.findCardInZone("north", "character", eb01Blueno017);
    const highPowerBlockerId = engine.findCardInZone("north", "character", op01Pacifista075);
    const secondAttackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.playCard(op01Shanks120, "south");
    const shanksId = engine.findCardInZone("south", "character", op01Shanks120);
    engine.declareAttack(shanksId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") {
      throw new Error("Expected Shanks's permitted Blocker choice.");
    }
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(highPowerBlockerId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      lowPowerBlockerId,
    );
    engine.resolveDecision("battleBlocker", { selectedIds: [highPowerBlockerId] }, "north");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(highPowerBlockerId);
    expect(
      view.players.north.characters.some((card) => card?.instanceId === lowPowerBlockerId),
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);

    engine.declareAttack(secondAttackerId, engine.leader("north"), "south");
    const nextBattleBlocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(nextBattleBlocker?.kind).toBe("selectEntity");
    if (nextBattleBlocker?.kind !== "selectEntity") {
      throw new Error("Expected Shanks's Blocker restriction to expire after its battle.");
    }
    expect(nextBattleBlocker.candidates.map((candidate) => candidate.ref.id)).toContain(
      lowPowerBlockerId,
    );
    engine.resolveDecision("battleBlocker", { selectedIds: [lowPowerBlockerId] }, "north");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      lowPowerBlockerId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
