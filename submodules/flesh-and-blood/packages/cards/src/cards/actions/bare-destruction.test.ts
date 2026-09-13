import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { packHuntYellow } from "./pack-hunt.ts";
import { beastModeRed } from "./beast-mode.ts";
import { barkboneStrapping } from "../equipment/barkbone-strapping.ts";
import { bareDestructionRed } from "./bare-destruction.ts";

describe("Bare Destruction (ARR008) AAA", () => {
  it("happy: beaten chest with no chest equipment grants go again and next Brute attack +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareDestructionRed, packHuntYellow, beastModeRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.play(bareDestructionRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Rhinar).toHaveAP(1);

    Rhinar.must.playAttack(packHuntYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: without beating chest this stays printed 6{p} and does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareDestructionRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(bareDestructionRed);
    expectCombat(game).notToHaveKeyword("go-again");
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Rhinar).toHaveAP(0);
  });

  it("timing: chest equipment in play blocks the beaten-chest go again latch", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareDestructionRed, packHuntYellow, beastModeRed],
        chest: [barkboneStrapping],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.play(bareDestructionRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    game.advanceCombatTo("defend");
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Rhinar).toHaveAP(0);
  });
});
