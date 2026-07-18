import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03BoaHancock026,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-026 Boa Hancock", () => {
  test("lets the five-card opponent bottom a hand card on play, but not at four", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03BoaHancock026],
        activeDon: 6,
      },
      {
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      },
    );
    const selectedId = engine.findCardInZone("north", "hand", eb01MountainGod018);
    const deckBefore = engine.getView("north").players.north.deckCount;

    engine.playCard(eb03BoaHancock026, "south");

    const choice = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(choice?.kind).toBe("selectEntity");
    if (choice?.kind !== "selectEntity") {
      throw new Error("Expected Boa Hancock's opponent to choose their hand card.");
    }
    expect(choice.candidates).toHaveLength(5);
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toContain(selectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(selectedId);
    expect(view.players.north.deckCount).toBe(deckBefore + 1);
    expect(engine.getState().players.north.deck.at(-1)).toBe(selectedId);
    expect(view.prompts).toHaveLength(0);

    const belowThreshold = OnePieceTestEngine.create(
      {
        hand: [eb03BoaHancock026],
        activeDon: 6,
      },
      {
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
    );
    belowThreshold.playCard(eb03BoaHancock026, "south");
    expect(belowThreshold.getView("north").players.north.handCount).toBe(4);
    expect(belowThreshold.getView("north").prompts).toHaveLength(0);
  });

  test("bottoms a chosen Character to give one rested DON!! each to its Leader and a Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb03BoaHancock026, eb01Doma005, eb01Fourtricks025],
      restedDon: 2,
    });
    const boaId = engine.findCardInZone("south", "character", eb03BoaHancock026);
    const costId = engine.findCardInZone("south", "character", eb01Doma005);
    const recipientId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.activateEffect(boaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnCharacterToDeck", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") {
      throw new Error("Expected Boa Hancock's Character-to-deck activation cost.");
    }
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      boaId,
      costId,
      recipientId,
    ]);
    engine.resolveDecision("effectCostReturnCharacterToDeck", { selectedIds: [costId] }, "south");

    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") {
      throw new Error("Expected Boa Hancock's Character DON!! recipient.");
    }
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual([boaId, recipientId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(view.players.south.restedDon).toBe(0);
    expect(engine.getState().players.south.deck.at(-1)).toBe(costId);
    expect(view.prompts).toHaveLength(0);

    const secondActivation = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: boaId,
      trigger: "activateMain",
    });
    expect(secondActivation.reason).toBe("This effect has already been used this turn.");
  });
});
