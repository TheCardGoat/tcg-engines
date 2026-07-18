import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08ElectricalLuna036 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-036 Electrical Luna", () => {
  test("Main automatically freezes all rested cost-7-or-less Characters through the next Refresh", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08ElectricalLuna036], activeDon: 3 },
      { character: [{ card: eb01Doma005, rested: true }] },
    );
    const target = engine.findCardInZone("north", "character", eb01Doma005);
    engine.playCard(op08ElectricalLuna036);
    engine.endTurn("south");
    expect(
      engine.getView("north").players.north.characters.find((c) => c?.instanceId === target)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Life Trigger maps an unrestricted opposing Character rest", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { life: [op08ElectricalLuna036] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const target = engine.findCardInZone("south", "character", eb01Doma005);
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
    expect(
      engine.getView("north").players.south.characters.find((c) => c?.instanceId === target)
        ?.rested,
    ).toBe(true);
  });
});
