import { describe, expect, test } from "vite-plus/test";
import { op02Blenheim012, op02Inuarashi027, op02TonyTonyChopper034 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-034 Tony Tony.Chopper", () => {
  test("with DON!! x1, rests only an opposing Character at the cost-2 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02TonyTonyChopper034, playedOnTurn: 0 }],
        activeDon: 1,
      },
      {
        character: [op02Blenheim012, op02Inuarashi027],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chopperId = engine.findCardInZone("south", "character", op02TonyTonyChopper034);
    const eligibleId = engine.findCardInZone("north", "character", op02Blenheim012);
    const ineligibleId = engine.findCardInZone("north", "character", op02Inuarashi027);

    engine.attachDon(chopperId, 1, "south");
    engine.declareAttack(chopperId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Chopper's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === ineligibleId)?.rested,
    ).toBe(false);
  });

  test("without DON!! x1, attacking does not offer the rest effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02TonyTonyChopper034, playedOnTurn: 0 }],
      },
      {
        character: [op02Blenheim012],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chopperId = engine.findCardInZone("south", "character", op02TonyTonyChopper034);
    const targetId = engine.findCardInZone("north", "character", op02Blenheim012);

    engine.declareAttack(chopperId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
