import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  eb02ThePeak008,
  op02Sanji026,
  op14eb04IHeardTheSoundOfALadySTeardropsFalling029,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("EB04-029 I Heard the Sound...of a Lady's Teardrops Falling", () => {
  test("lets a Sanji Leader choose either a Sanji or Event from the top 3 and trashes the rest", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02Sanji026,
      hand: [op14eb04IHeardTheSoundOfALadySTeardropsFalling029],
      deck: [eb01Sanji014, eb02ThePeak008, eb01Doma005, eb01MountainGod018],
      activeDon: 1,
    });
    const eventId = engine.findCardInZone(
      "south",
      "hand",
      op14eb04IHeardTheSoundOfALadySTeardropsFalling029,
    );
    const sanjiId = engine.findCardInZone("south", "deck", eb01Sanji014);
    const selectedEventId = engine.findCardInZone("south", "deck", eb02ThePeak008);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);
    engine.playCard(op14eb04IHeardTheSoundOfALadySTeardropsFalling029);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the Sanji controller to receive the private top-3 search choice.");
    }
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: sanjiId, legal: true },
      { id: selectedEventId, legal: true },
      { id: unrelatedId, legal: false },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedEventId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.some((card) => card.instanceId === selectedEventId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, sanjiId, unrelatedId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("maps the optional hand cost and Sanji-only Counter recipient into battle power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op02Sanji026,
        hand: [op14eb04IHeardTheSoundOfALadySTeardropsFalling029, eb01Doma005, eb01Fourtricks025],
        character: [eb01Sanji014, eb01Doma005],
        activeDon: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op14eb04IHeardTheSoundOfALadySTeardropsFalling029,
    );
    const selectedCostId = engine.findCardInZone("north", "hand", eb01Doma005);
    const otherCostId = engine.findCardInZone("north", "hand", eb01Fourtricks025);
    const sanjiCharacterId = engine.findCardInZone("north", "character", eb01Sanji014);
    const unrelatedCharacterId = engine.findCardInZone("north", "character", eb01Doma005);

    const lifeBeforeAttack = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "north");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the defender to receive the Counter hand-trash cost.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedCostId,
      otherCostId,
    ]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [selectedCostId] }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the Sanji Counter recipient choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      sanjiCharacterId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      unrelatedCharacterId,
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBeforeAttack);
    expect(view.players.north.hand.some((card) => card.instanceId === otherCostId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, selectedCostId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
