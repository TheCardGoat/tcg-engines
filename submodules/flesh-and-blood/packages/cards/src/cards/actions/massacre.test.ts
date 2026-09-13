import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { bloodrushBellowYellow } from "./bloodrush-bellow.ts";
import { packHuntYellow } from "./pack-hunt.ts";
import { massacreRed } from "./massacre.ts";

describe("Massacre (CRU008) AAA", () => {
  it("happy: discarded 6+{p} this turn grants Massacre +2{p} and intimidate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bloodrushBellowYellow, alphaRampageRed, massacreRed],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [packHuntYellow], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle();

    Rhinar.playAttack(massacreRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(10);
    expectFabCard(Dash, packHuntYellow).toBeBanished();
  });

  it("boundary: without a 6+{p} discard this turn Massacre stays printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [massacreRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [packHuntYellow], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(massacreRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(game.as(dash), packHuntYellow).toBeIn("hand");
  });

  it("timing: discarding Massacre to pay a Brute attack action intimidates", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bloodrushBellowYellow, massacreRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [packHuntYellow], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Rhinar, massacreRed).toBeIn("graveyard");
    expectFabCard(game.as(dash), packHuntYellow).toBeBanished();
  });
});
