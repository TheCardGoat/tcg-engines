import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, eb01TonyTonyChopper006, st01DiableJambe016 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("ST01-016 Diable Jambe", () => {
  test("Main makes an included Straw Hat Crew Leader's attack bypass Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [st01DiableJambe016], activeDon: 1 },
      { character: [eb01TonyTonyChopper006], life: 2 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const blockerId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.playCard(st01DiableJambe016);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger K.O.s an opposing cost-3-or-less Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01TonyTonyChopper006] },
      { life: [st01DiableJambe016] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const blockerId = engine.findCardInZone("south", "character", eb01TonyTonyChopper006);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [blockerId] }, "north");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      blockerId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
