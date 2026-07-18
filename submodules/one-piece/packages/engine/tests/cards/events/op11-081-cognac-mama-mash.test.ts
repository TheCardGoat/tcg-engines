import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb02DonAccino004,
  op11CognacMamaMash081,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP11-081 Cognac Mama-Mash", () => {
  test("Main reveals a matching top-deck cost before K.O.ing the base-cost-8 boundary", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11CognacMamaMash081], activeDon: 6 },
      { deck: [eb01Doma005], character: [eb02DonAccino004, eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb02DonAccino004);

    engine.playCard(op11CognacMamaMash081);
    engine.resolveDecision("effectGuessTopDeckCost", { optionId: "1" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(
      engine.getView("south").logs.some((entry) => entry.message.includes("reveals Doma")),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger adds up to one active DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op11CognacMamaMash081], donDeckCount: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    expect(engine.getView("north").players.north).toMatchObject({ activeDon: 1, donDeckCount: 0 });
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
