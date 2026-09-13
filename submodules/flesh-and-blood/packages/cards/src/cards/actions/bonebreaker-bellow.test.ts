import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { packHuntYellow } from "./pack-hunt.ts";
import { snatchRed } from "./snatch.ts";
import { beastModeRed } from "./beast-mode.ts";
import { bonebreakerBellowRed, bonebreakerBellowYellow } from "./bonebreaker-bellow.ts";

describe("Bonebreaker Bellow (HVY041) AAA", () => {
  it("happy: next Brute attack this turn gains +3", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bonebreakerBellowRed, packHuntYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.must.play(bonebreakerBellowRed);
    game.passBoth();
    Rhinar.must.playAttack(packHuntYellow);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(8);
  });

  it("color variant: the yellow member grants +2", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bonebreakerBellowYellow, packHuntYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.must.play(bonebreakerBellowYellow);
    game.passBoth();
    Rhinar.must.playAttack(packHuntYellow);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a non-Brute attack does not get the bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bonebreakerBellowRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.must.play(bonebreakerBellowRed);
    game.passBoth();
    Rhinar.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: beaten chest this turn replaces +3 with +5", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bonebreakerBellowRed, packHuntYellow, beastModeRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.play(bonebreakerBellowRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    game.helpers.resolveUntilIdle();
    Rhinar.must.playAttack(packHuntYellow);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(10);
  });
});
