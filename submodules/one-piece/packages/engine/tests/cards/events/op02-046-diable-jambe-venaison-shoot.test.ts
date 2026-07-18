import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op01Marco023,
  op01Sanji013,
  op02DiableJambeVenaisonShoot046,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-046 Diable Jambe Venaison Shoot", () => {
  test("K.O.s only a rested opposing Character at the cost-4 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02DiableJambeVenaisonShoot046],
        activeDon: 2,
      },
      {
        character: [
          { card: eb01Fourtricks025, rested: true },
          eb01Doma005,
          { card: eb01MountainGod018, rested: true },
        ],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const activeId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op02DiableJambeVenaisonShoot046);

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose an eligible rested Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === activeId)).toBe(true);
    expect(view.players.north.characters.some((card) => card?.instanceId === tooExpensiveId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger offers only cost-4-or-less Characters with no base effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op01Hajrudin018, op01Marco023, op01Sanji013],
        life: [op02DiableJambeVenaisonShoot046],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const boundaryId = engine.findCardInZone("north", "hand", op01Hajrudin018);
    const lowerCostId = engine.findCardInZone("north", "hand", op01Marco023);
    const effectCharacterId = engine.findCardInZone("north", "hand", op01Sanji013);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose a no-effect Character to play.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      boundaryId,
      lowerCostId,
    ]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      effectCharacterId,
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [boundaryId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === boundaryId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
