import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Pell014,
  op09ThunderLanceFlipCaliberPhoenixShot040,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-040 Thunder Lance Flip Caliber Phoenix Shot", () => {
  test("Main requires two rested Characters before mapping the cost-4 K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09ThunderLanceFlipCaliberPhoenixShot040],
        character: [
          { card: eb01Doma005, rested: true },
          { card: op05Pell014, rested: true },
        ],
        activeDon: 3,
      },
      { character: [op05Pell014] },
    );
    const targetId = engine.findCardInZone("north", "character", op05Pell014);

    engine.playCard(op09ThunderLanceFlipCaliberPhoenixShot040);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger rests the cost-4 boundary without the Main condition", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op05Pell014] },
      { life: [op09ThunderLanceFlipCaliberPhoenixShot040] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op05Pell014);

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
