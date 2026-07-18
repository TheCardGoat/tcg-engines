import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07BoaMarigold052,
  op07GloriosaGrandmaNyon041,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-052 Boa Marigold", () => {
  test("counts mixed Amazon Lily and Kuja Pirates Characters and may bottom-deck either player's low-cost Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07BoaMarigold052],
        character: [op07GloriosaGrandmaNyon041],
        activeDon: op07BoaMarigold052.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const ownId = engine.findCardInZone("south", "character", op07GloriosaGrandmaNyon041);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const ownDeckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op07BoaMarigold052, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Marigold's deck choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(ownDeckBefore + 1);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(ownId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer a target with fewer than two matching Characters", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07BoaMarigold052], activeDon: op07BoaMarigold052.cost },
      { character: [eb01Doma005] },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op07BoaMarigold052, "south");

    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(opposingId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
