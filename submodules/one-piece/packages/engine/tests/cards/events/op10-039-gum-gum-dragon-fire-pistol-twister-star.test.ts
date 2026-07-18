import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09Lim022,
  op10EdwardNewgate024,
  op10Enel025,
  op10GumGumDragonFirePistolTwisterStar039,
  op10Nami013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-039 Gum-Gum Dragon Fire Pistol Twister Star", () => {
  test("Main accepts an included ODYSSEY Leader and searches two included ODYSSEY Characters", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Lim022,
      hand: [op10GumGumDragonFirePistolTwisterStar039],
      deck: [
        op10EdwardNewgate024,
        op10Enel025,
        eb01Doma005,
        op10GumGumDragonFirePistolTwisterStar039,
        eb01MountainGod018,
      ],
      activeDon: 3,
    });
    const firstId = engine.findCardInZone("south", "deck", op10EdwardNewgate024);
    const secondId = engine.findCardInZone("south", "deck", op10Enel025);
    const revealedIds = engine.getState().players.south.deck.slice(0, 5);

    engine.playCard(op10GumGumDragonFirePistolTwisterStar039);

    const decision = engine.pendingDecision("effectSearchSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the private ODYSSEY Character search.");
    }
    expect(step.candidates.find((candidate) => candidate.ref.id === firstId)?.legal).toBe(true);
    expect(step.candidates.find((candidate) => candidate.ref.id === secondId)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [firstId, secondId] }, "south");
    const remainder = revealedIds.filter(
      (instanceId) => instanceId !== firstId && instanceId !== secondId,
    );
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [...remainder].reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstId, secondId]),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger rests the cost-5 boundary without the Main Leader condition", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op10Nami013],
      },
      { life: [op10GumGumDragonFirePistolTwisterStar039] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op10Nami013);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
