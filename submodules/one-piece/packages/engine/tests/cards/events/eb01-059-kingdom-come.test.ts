import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01KingdomCome059,
  eb01MountainGod018,
  eb01Mr1DazBonez027,
  op01Fukurokuju110,
  op13Higuma013,
  op13Otama043,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-059 Kingdom Come", () => {
  test("K.O.s a chosen Character, then trashes top Life until exactly 1 remains", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01KingdomCome059],
        life: [op13Otama043, op13Higuma013, op13York094, eb01Doma005],
        activeDon: 6,
      },
      {
        character: [eb01Mr1DazBonez027, op01Fukurokuju110],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", eb01KingdomCome059);
    const selectedId = engine.findCardInZone("north", "character", eb01Mr1DazBonez027);
    const otherId = engine.findCardInZone("north", "character", op01Fukurokuju110);
    const topLifeIds = [
      engine.findCardInZone("south", "life", op13Otama043),
      engine.findCardInZone("south", "life", op13Higuma013),
      engine.findCardInZone("south", "life", op13York094),
    ];
    const remainingLifeId = engine.findCardInZone("south", "life", eb01Doma005);

    engine.playCard(eb01KingdomCome059);

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("south");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Kingdom Come to publish its opposing Character choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedId,
      otherId,
    ]);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.north.characters.some((card) => card?.instanceId === otherId)).toBe(true);
    expect(view.players.south.lifeCount).toBe(1);
    expect(engine.getState().players.south.life).toEqual([remainingLifeId]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, ...topLifeIds]),
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 6 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("uses both players' post-damage Life total for its Trigger cost boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          eb01Mr1DazBonez027,
          op01Fukurokuju110,
        ],
        life: 3,
      },
      {
        life: [eb01KingdomCome059, op13Otama043, op13Higuma013],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "character", eb01Mr1DazBonez027);
    const tooExpensiveId = engine.findCardInZone("south", "character", op01Fukurokuju110);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    expect(triggerDecision).toMatchObject({ actorId: "north", kind: "confirm" });
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("north");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to receive the Trigger K.O. choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      attackerId,
      eligibleId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      tooExpensiveId,
    );

    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.characters.some((card) => card?.instanceId === tooExpensiveId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(eb01KingdomCome059.id);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
