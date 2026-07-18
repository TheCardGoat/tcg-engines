import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02Blugori084,
  op05Pagaya109,
  op05Shura106,
  op05UpperYard117,
  op08Kalgara098,
  op08TheEarthWillNotLose115,
  op13Higuma013,
  op13Otama043,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-115 The Earth Will Not Lose!", () => {
  test("Counter accepts the Leader's included type, powers the defender, and offers Upper Yard to play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op08Kalgara098,
        hand: [op08TheEarthWillNotLose115, op05UpperYard117, eb01Doma005],
        deck: [
          op05Shura106,
          op13Higuma013,
          op05Pagaya109,
          op13Otama043,
          op13York094,
          op02Blugori084,
        ],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op08TheEarthWillNotLose115);
    const stageId = engine.findCardInZone("north", "hand", op05UpperYard117);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    const revealedIds = engine.getState().players.north.deck.slice(0, 5).reverse();

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the Upper Yard hand-play choice.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([stageId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [stageId] }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: revealedIds }, "north");

    expect(engine.getView("north").players.north.stage?.instanceId).toBe(stageId);
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws two, then gives the controller the resulting hand-trash choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [eb01Doma005],
        life: [op08TheEarthWillNotLose115],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const trashDecision = engine.pendingDecision("effectTrashFromHandSelection", "north");
    const trashStep = trashDecision.steps[0];
    expect(trashStep?.kind).toBe("selectEntity");
    if (trashStep?.kind !== "selectEntity") {
      throw new Error("Expected the post-draw hand-trash choice.");
    }
    expect(trashStep.candidates).toHaveLength(3);
    const selectedId = trashStep.candidates[0]?.ref.id;
    if (!selectedId) {
      throw new Error("Expected at least one hand card to trash.");
    }
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [selectedId] }, "north");

    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").players.north.hand).toHaveLength(2);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
