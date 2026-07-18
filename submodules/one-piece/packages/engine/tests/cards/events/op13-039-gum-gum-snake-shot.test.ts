import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op12Gyukimaru024,
  op13GumGumSnakeShot039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-039 Gum-Gum Snake Shot", () => {
  test("Life Trigger activates Counter and K.O.s the rested cost-4 attacker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op12Gyukimaru024, playedOnTurn: 0 }] },
      {
        life: [op13GumGumSnakeShot039],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op12Gyukimaru024);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      attackerId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
