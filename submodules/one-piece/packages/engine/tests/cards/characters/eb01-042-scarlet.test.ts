import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MsMonday035,
  eb01Scarlet042,
  op04Kyros082,
  op04Rebecca039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-042 Scarlet", () => {
  test("plays Kyros rested and reduces cost before Kyros maps its On Play target", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        character: [eb01Scarlet042],
        hand: [op04Kyros082],
        deck: [eb01Doma005],
      },
      { character: [eb01MsMonday035] },
    );
    const scarletId = engine.findCardInZone("south", "character", eb01Scarlet042);
    const kyrosId = engine.findCardInZone("south", "hand", op04Kyros082);
    const targetId = engine.findCardInZone("north", "character", eb01MsMonday035);

    engine.activateEffect(scarletId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") {
      throw new Error("Expected Scarlet's rested Dressrosa play choice.");
    }
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([kyrosId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [kyrosId] }, "south");

    const costReduction = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(costReduction?.kind).toBe("selectEntity");
    if (costReduction?.kind !== "selectEntity") {
      throw new Error("Expected Scarlet's opponent Character cost-reduction choice.");
    }
    expect(costReduction.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const kyrosKo = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(kyrosKo?.kind).toBe("selectEntity");
    if (kyrosKo?.kind !== "selectEntity") {
      throw new Error("Expected played Kyros to see Scarlet's reduced-cost target.");
    }
    expect(kyrosKo.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(scarletId);
    expect(view.players.south.characters.find((card) => card?.instanceId === kyrosId)?.rested).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.deckCount).toBe(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        character: [eb01Scarlet042],
        hand: [op04Kyros082],
        deck: [eb01Doma005],
      },
      { character: [eb01MsMonday035] },
    );
    const scarletId = engine.findCardInZone("south", "character", eb01Scarlet042);
    engine.activateEffect(scarletId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
