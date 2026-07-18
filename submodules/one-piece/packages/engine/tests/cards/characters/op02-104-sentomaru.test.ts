import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op02Sentomaru104 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("OP02-104 Sentomaru", () => {
  test("plays the physical card whose Life Trigger was activated", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op02Sentomaru104] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sentomaruId = engine.findCardInZone("north", "life", op02Sentomaru104);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(sentomaruId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(sentomaruId);
    expect(view.prompts).toHaveLength(0);
  });
});
