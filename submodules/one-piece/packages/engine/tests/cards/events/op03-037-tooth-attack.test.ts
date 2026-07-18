import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03Lilith058,
  op01Hajrudin018,
  op03Alvida023,
  op03Hatchan033,
  op03ToothAttack037,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-037 Tooth Attack", () => {
  test("rests a compound East Blue Character to K.O. the rested cost-3 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03ToothAttack037],
        character: [op03Alvida023],
        activeDon: 1,
      },
      {
        character: [
          { card: eb01Fourtricks025, rested: true },
          { card: op01Hajrudin018, rested: true },
        ],
      },
    );
    const costId = engine.findCardInZone("south", "character", op03Alvida023);
    const boundaryId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const excludedId = engine.findCardInZone("north", "character", op01Hajrudin018);

    engine.playCard(op03ToothAttack037);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === costId)?.rested).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(boundaryId);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger offers only a cost-4-or-less Character that has a Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op03Hatchan033, op01Hajrudin018, eb03Lilith058],
        life: [op03ToothAttack037],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("north", "hand", op03Hatchan033);
    const noTriggerId = engine.findCardInZone("north", "hand", op01Hajrudin018);
    const tooExpensiveId = engine.findCardInZone("north", "hand", eb03Lilith058);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose a low-cost Trigger Character.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(noTriggerId);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === selectedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
