import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { spinningWheelKickYellow } from "./spinning-wheel-kick.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { cycloneRoundhouseYellow } from "./cyclone-roundhouse.ts";

describe("Cyclone Roundhouse (OUT050) AAA", () => {
  it("happy: after Spinning Wheel Kick, reaction-step banishes a defending card", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [spinningWheelKickYellow, cycloneRoundhouseYellow],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(spinningWheelKickYellow);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(cycloneRoundhouseYellow);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue]);
    game.toReaction("attacker");
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, brutalAssaultBlue).toBeIn("banished");
  });

  it("boundary: without Spinning Wheel Kick, defenders stay on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [cycloneRoundhouseYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(cycloneRoundhouseYellow);
    expectCombat(game).toHaveAttackPower(5);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [cycloneRoundhouseYellow], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Katsu.defendWith([cycloneRoundhouseYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Katsu).toHaveLife(19);
  });
});
