import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04Kaido044,
  op04Queen040,
  op14eb04King031,
  op14eb04Queen032,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-032 Queen", () => {
  test("trashes an Animal Kingdom Pirates hand card to draw 2, then pays 2 DON!! to add one rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04Queen040,
      hand: [op14eb04Queen032, op14eb04King031, op04Kaido044, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: 3,
      donDeckCount: 1,
    });
    const eligibleCostId = engine.findCardInZone("south", "hand", op14eb04King031);
    const otherEligibleId = engine.findCardInZone("south", "hand", op04Kaido044);
    const ineligibleId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnIds = engine.getState().players.south.deck.slice(0, 2);

    engine.playCard(op14eb04Queen032, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const handCost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(handCost?.kind).toBe("payCost");
    if (handCost?.kind !== "payCost") throw new Error("Expected Queen's filtered hand cost.");
    expect(handCost.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleCostId);
    expect(handCost.candidates.map((candidate) => candidate.ref.id)).toContain(otherEligibleId);
    expect(handCost.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [eligibleCostId] }, "south");

    const queenId = engine.findCardInZone("south", "character", op14eb04Queen032);
    engine.activateEffect(queenId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([ineligibleId, ...drawnIds]),
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleCostId);
    expect(view.players.south).toMatchObject({
      activeDon: 0,
      restedDon: 4,
      donDeckCount: 0,
    });
    expect(view.prompts).toHaveLength(0);
  });

  test("pays the 2-DON!! activation cost before a nonmatching Leader gate prevents the add", () => {
    const engine = OnePieceTestEngine.create({
      character: [op14eb04Queen032],
      activeDon: 2,
      donDeckCount: 1,
    });
    const queenId = engine.findCardInZone("south", "character", op14eb04Queen032);

    engine.activateEffect(queenId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: 0,
      restedDon: 2,
      donDeckCount: 1,
    });
    expect(view.prompts).toHaveLength(0);
  });
});
