import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb01MountainGod018,
  op07DemonicAuraNineSwordStyleAsuraDemonNineFlash036,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-036 Demonic Aura Nine-Sword Style Asura Demon Nine Flash", () => {
  test("Main resolves power before the optional cost-3 rest payment and opposing cost-5 rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07DemonicAuraNineSwordStyleAsuraDemonNineFlash036],
        character: [eb01Fourtricks025],
        activeDon: 2,
      },
      {
        character: [eb01MountainGod018],
      },
    );
    const costId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const powerBefore = engine.getView("south").players.south.leader.power;

    engine.playCard(op07DemonicAuraNineSwordStyleAsuraDemonNineFlash036);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.leader.power).toBe(powerBefore! + 3000);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === costId)
        ?.rested,
    ).toBe(true);
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger rests only an opposing effective cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Fourtricks025],
      },
      {
        life: [op07DemonicAuraNineSwordStyleAsuraDemonNineFlash036],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Fourtricks025);

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
