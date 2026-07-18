import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03CharlotteSmoothie051,
  op05Conis104,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-051 Charlotte Smoothie", () => {
  test("K.O.s only a cost-2-or-less opposing Character, then turns all Life face-down", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03CharlotteSmoothie051],
        life: [
          { card: eb01Doma005, faceUp: true, publicKnowledge: true },
          { card: eb01Fourtricks025, faceUp: true, publicKnowledge: true },
        ],
        activeDon: eb03CharlotteSmoothie051.cost,
      },
      {
        character: [eb01Doma005, op05Conis104, eb01MountainGod018],
      },
    );
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const otherLowCostId = engine.findCardInZone("north", "character", op05Conis104);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeIds = [...engine.getState().players.south.life];

    engine.playCard(eb03CharlotteSmoothie051, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Smoothie's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      lowCostId,
      otherLowCostId,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lowCostId);
    expect(lifeIds.map((instanceId) => engine.getState().cards[instanceId]?.faceUp)).toEqual([
      false,
      false,
    ]);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not K.O. or turn Life face-down without a face-up Life card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03CharlotteSmoothie051],
        life: [eb01Doma005, eb01Fourtricks025],
        activeDon: eb03CharlotteSmoothie051.cost,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeIds = [...engine.getState().players.south.life];

    engine.playCard(eb03CharlotteSmoothie051, "south");

    const view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(lifeIds.map((instanceId) => engine.getState().cards[instanceId]?.faceUp)).toEqual([
      false,
      false,
    ]);
  });
});
