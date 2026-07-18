import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07Crocodile040,
  op07RoronoaZoro034,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-040 Crocodile", () => {
  test("may rest one DON!! to return an eligible Character on either field to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07Crocodile040],
        character: [op07RoronoaZoro034],
        activeDon: op07Crocodile040.cost + 1,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const ownId = engine.findCardInZone("south", "character", op07RoronoaZoro034);
    const opposingLowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const opposingHighCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op07Crocodile040, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Crocodile's return choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingLowCostId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingHighCostId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(ownId);
    expect(
      view.players.north.characters.some((card) => card?.instanceId === opposingLowCostId),
    ).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the optional DON!! payment and return no Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07Crocodile040],
        activeDon: op07Crocodile040.cost + 1,
      },
      { character: [eb01Doma005] },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op07Crocodile040, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === opposingId)).toBe(
      true,
    );
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 4 });
    expect(view.prompts).toHaveLength(0);
  });
});
