import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Koby098,
  op02Sakazuki099,
  op03Vergo079,
  op09DocQ090,
  op10Smoker001,
  op10Vergo004,
  prb02SengokuSt19002PirateFoil002,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST19-002 Sengoku", () => {
  test("with an included Navy Leader trashes exactly two black included Navy cards to draw three", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10Smoker001,
      hand: [
        prb02SengokuSt19002PirateFoil002,
        op02Koby098,
        op03Vergo079,
        op02Sakazuki099,
        op10Vergo004,
        op09DocQ090,
      ],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: prb02SengokuSt19002PirateFoil002.cost,
    });
    const eligibleIds = [
      engine.findCardInZone("south", "hand", op02Koby098),
      engine.findCardInZone("south", "hand", op03Vergo079),
    ];
    const wrongColorId = engine.findCardInZone("south", "hand", op10Vergo004);
    const wrongTraitId = engine.findCardInZone("south", "hand", op09DocQ090);
    const otherEligibleId = engine.findCardInZone("south", "hand", op02Sakazuki099);
    const drawnIds = [...engine.getState().players.south.deck];

    engine.playCard(prb02SengokuSt19002PirateFoil002, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Sengoku's filtered hand cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([...eligibleIds, otherEligibleId]),
    );
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongColorId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: eligibleIds }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(eligibleIds),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([otherEligibleId, wrongColorId, wrongTraitId, ...drawnIds]),
    );
    expect(view.players.south.deckCount).toBe(0);
  });

  test("may pay the Navy cost with a non-Navy Leader without drawing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [prb02SengokuSt19002PirateFoil002, op02Koby098, op03Vergo079],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: prb02SengokuSt19002PirateFoil002.cost,
    });
    engine.playCard(prb02SengokuSt19002PirateFoil002, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(3);
    expect(view.prompts).toHaveLength(0);
  });
});
