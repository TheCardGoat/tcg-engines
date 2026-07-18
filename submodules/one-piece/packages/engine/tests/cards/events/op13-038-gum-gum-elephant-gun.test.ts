import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op12Karasu085,
  op13GumGumElephantGun038,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-038 Gum-Gum Elephant Gun", () => {
  test("Main rests a cost-5 Character now and activates DON!! only at end of turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13GumGumElephantGun038], activeDon: 2 },
      { character: [op12Karasu085] },
    );
    const targetId = engine.findCardInZone("north", "character", op12Karasu085);

    engine.playCard(op13GumGumElephantGun038);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
    engine.endTurn("south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 2, restedDon: 0 });
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger rests one opposing cost-5 Character without scheduling DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op12Karasu085] },
      {
        life: [op13GumGumElephantGun038],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op12Karasu085);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
    expect(engine.getState().delayedEffectActions).toHaveLength(0);
  });
});
