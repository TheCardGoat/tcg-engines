import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { sproutStrengthRed } from "./sprout-strength.ts";
import { snatchRed } from "./snatch.ts";
import { brutalAssaultBlue, briar } from "../shared/test-recipients.ts";
import { strengthOfFourSeasonsRed } from "./strength-of-four-seasons.ts";

/**
 * Strength of Four Seasons, Red (ROS058) — Earth Action - Attack, cost 2,
 * 4{p}, 2{d}.
 *
 * Printed: "If there are 4 or more Earth cards in your banished zone, this
 * gets +4{p}."
 *
 * Briar (ELE063) is the Earth/Lightning/Elemental seat. The +4 is a
 * zone-count on the controller's banished zone; Generic banished cards do
 * not count.
 */

describe("Strength of Four Seasons (ROS058) AAA", () => {
  it("happy: 4 Earth cards in banished grant +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [strengthOfFourSeasonsRed],
        banished: [sproutStrengthRed, sproutStrengthRed, sproutStrengthRed, sproutStrengthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(strengthOfFourSeasonsRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(8);
  });

  it("boundary: 4 Generic banished cards do not grant +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [strengthOfFourSeasonsRed],
        banished: [snatchRed, snatchRed, brutalAssaultBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(strengthOfFourSeasonsRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
  });

  it("timing: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: briar, hand: [strengthOfFourSeasonsRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith([strengthOfFourSeasonsRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveLife(18);
    expectFabCard(Briar, strengthOfFourSeasonsRed).toBeIn("graveyard");
  });
});
