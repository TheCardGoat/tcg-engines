import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01Komachiyo010,
  op02Sphinx088,
  op04Otama097,
  op14eb04HitokiriKamazo035,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-097 Otama", () => {
  test("puts an opposing low-cost Animal or SMILE Character on top of its owner's Life face-up", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04Otama097],
        activeDon: op04Otama097.cost,
      },
      {
        character: [op01Komachiyo010, op14eb04HitokiriKamazo035, op02Sphinx088, eb01Doma005],
        life: [eb01Doma005],
      },
    );
    const animalId = engine.findCardInZone("north", "character", op01Komachiyo010);
    const smileId = engine.findCardInZone("north", "character", op14eb04HitokiriKamazo035);
    const expensiveId = engine.findCardInZone("north", "character", op02Sphinx088);
    const unrelatedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op04Otama097, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Otama's Character choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([animalId, smileId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [smileId] }, "south");

    const southView = engine.getView("south");
    expect(southView.players.north.characters.map((card) => card?.instanceId)).not.toContain(
      smileId,
    );
    expect(engine.getState().players.north.life[0]).toBe(smileId);
    expect(engine.getState().cards[smileId]?.faceUp).toBe(true);
    expect(southView.prompts).toHaveLength(0);
  });
});
