import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op09DocQ090,
  op09Usopp024,
  op10Franky014,
  op10Liberation098,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-098 Liberation", () => {
  test("Main accepts an exact two-Character deficit and resolves both independent K.O.s", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10Liberation098], activeDon: 6 },
      { character: [op10Franky014, op09Usopp024] },
    );
    const costSixId = engine.findCardInZone("north", "character", op10Franky014);
    const costFourId = engine.findCardInZone("north", "character", op09Usopp024);

    engine.playCard(op10Liberation098);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costSixId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costFourId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([costSixId, costFourId]),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger separately negates one opposing Leader and one opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op09DocQ090, playedOnTurn: 0 },
        ],
      },
      { life: [op10Liberation098] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const characterId = engine.findCardInZone("south", "character", op09DocQ090);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "north");

    const failure = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: characterId,
      trigger: "activateMain",
    });
    expect(failure.reason).toBe("This card does not have that activation timing.");
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
