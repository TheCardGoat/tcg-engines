import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op11GumGumJetCulverin061 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP11-061 Gum-Gum Jet Culverin", () => {
  test("Main bottom-decks an opposing Character at the base-cost-4 boundary", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11GumGumJetCulverin061], activeDon: 3 },
      { character: [eb01MountainGod018, eb01Doma005] },
    );
    const selectedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op11GumGumJetCulverin061);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    expect(engine.getState().players.north.deck.at(-1)).toBe(selectedId);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger offers both fields and routes the chosen cost-1 Character to its owner's deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { life: [op11GumGumJetCulverin061], character: [eb01Doma005] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingId = engine.findCardInZone("south", "character", eb01Doma005);
    const ownId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const decision = engine.pendingDecision("effectTargetSelection", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected an owner-neutral Trigger choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "north");

    expect(engine.getState().players.south.deck.at(-1)).toBe(opposingId);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
