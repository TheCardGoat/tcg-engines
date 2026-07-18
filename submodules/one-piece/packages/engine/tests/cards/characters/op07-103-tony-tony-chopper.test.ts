import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07Pythagoras105,
  op07TonyTonyChopper103,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-103 Tony Tony.Chopper", () => {
  test("Trigger grants Blocker to an included Egghead Character for the turn, then adds itself to hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        life: [op07TonyTonyChopper103],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [op07Pythagoras105, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstAttackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const secondAttackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const pythagorasId = engine.findCardInZone("north", "character", op07Pythagoras105);
    const wrongTraitId = engine.findCardInZone("north", "character", eb01Doma005);
    const chopperId = engine.findCardInZone("north", "life", op07TonyTonyChopper103);

    engine.declareAttack(firstAttackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const grant = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (grant?.kind !== "selectEntity") throw new Error("Expected Chopper's Blocker recipient.");
    expect(grant.candidates.map((candidate) => candidate.ref.id)).toContain(pythagorasId);
    expect(grant.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [pythagorasId] }, "north");
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      chopperId,
    );

    engine.declareAttack(secondAttackerId, engine.leader("north"), "south");
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected granted Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(pythagorasId);
  });

  test("may grant no Blocker and still adds itself to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op07TonyTonyChopper103],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [op07Pythagoras105],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const chopperId = engine.findCardInZone("north", "life", op07TonyTonyChopper103);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      chopperId,
    );
  });
});
