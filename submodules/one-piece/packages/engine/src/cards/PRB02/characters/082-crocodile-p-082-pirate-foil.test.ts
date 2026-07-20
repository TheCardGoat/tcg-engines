import { eb01Doma005, op01Crocodile062, op03Kaya044, op09Buggy042 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02CrocodileP082PirateFoil082 } from "../../../../../cards/src/cards/PRB02/characters/082-crocodile-p-082-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-082 Crocodile - P-082 (Pirate Foil)", () => {
  test("under either included Leader trait, maps only opposing power-2000 targets to deck bottom", () => {
    for (const leaderCardId of [op09Buggy042, op01Crocodile062]) {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId,
          hand: [prb02CrocodileP082PirateFoil082],
          character: [op03Kaya044],
          activeDon: prb02CrocodileP082PirateFoil082.cost,
        },
        { character: [op03Kaya044, eb01Doma005] },
      );
      const ownLowPowerId = engine.findCardInZone("south", "character", op03Kaya044);
      const opposingLowPowerId = engine.findCardInZone("north", "character", op03Kaya044);
      const opposingHighPowerId = engine.findCardInZone("north", "character", eb01Doma005);
      const opposingDeckBefore = engine.getView("south").players.north.deckCount;

      engine.playCard(prb02CrocodileP082PirateFoil082, "south");
      const decision = engine.pendingDecision("effectTargetSelection", "south");
      expect(decision.actorId).toBe("south");
      const target = decision.steps[0];
      if (target?.kind !== "selectEntity") throw new Error("Expected Crocodile's target choice.");
      expect(target).toMatchObject({ min: 0, max: 1 });
      expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(opposingLowPowerId);
      expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownLowPowerId);
      expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
        opposingHighPowerId,
      );
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: [opposingLowPowerId] },
        "south",
      );

      const view = engine.getView("south");
      expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(
        opposingLowPowerId,
      );
      expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(
        opposingHighPowerId,
      );
      expect(view.players.north.deckCount).toBe(opposingDeckBefore + 1);
      expect(view.prompts).toHaveLength(0);
    }
  });

  test("without either Leader trait, does not offer the low-power opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb02CrocodileP082PirateFoil082],
        activeDon: prb02CrocodileP082PirateFoil082.cost,
      },
      { character: [op03Kaya044] },
    );
    const opposingId = engine.findCardInZone("north", "character", op03Kaya044);

    engine.playCard(prb02CrocodileP082PirateFoil082, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });
});
