import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op11Jinbe021,
  op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-059 Please Take Me with You!! I Can Be of Great Help to You!!", () => {
  test("Main draws two for Jinbe after Event payment leaves two or fewer cards in hand", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Jinbe021,
      hand: [op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059],
      activeDon: 1,
    });
    engine.playCard(op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059);
    expect(engine.getView("south").players.south.hand).toHaveLength(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger lets the damaged player return either field's cost-4-or-less Character to its owner", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { life: [op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059], character: [eb01Doma005] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingId = engine.findCardInZone("south", "character", eb01Doma005);
    const ownId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north");
    const step = target.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected an either-field return choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "north");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      opposingId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
