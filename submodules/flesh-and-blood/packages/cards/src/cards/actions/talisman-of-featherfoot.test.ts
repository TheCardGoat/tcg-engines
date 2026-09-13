import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { vigorRushYellow } from "./vigor-rush.ts";
import { comeToFightRed } from "./come-to-fight.ts";
import { fangStrike } from "../attack-reactions/fang-strike.ts";
import { talismanOfFeatherfootYellow } from "./talisman-of-featherfoot.ts";

describe("Talisman of Featherfoot (EVR190) AAA", () => {
  it("happy: exactly +1{p} during the reaction step destroys this and grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfFeatherfootYellow],
        hand: [vigorRushYellow, fangStrike],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(vigorRushYellow);
    game.advanceCombatTo("reaction");
    Bravo.play(fangStrike);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, talismanOfFeatherfootYellow).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: +{p} outside the reaction step does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfFeatherfootYellow],
        hand: [comeToFightRed, vigorRushYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(comeToFightRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(vigorRushYellow);

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Bravo, talismanOfFeatherfootYellow).toBeIn("arena");
  });

  it("timing: a miss still keeps the granted go again leftover AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfFeatherfootYellow],
        hand: [vigorRushYellow, fangStrike],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(vigorRushYellow);
    game.as(dash).defendWith();
    game.advanceCombatTo("reaction");
    Bravo.play(fangStrike);
    game.closeCombat();

    expectFabCard(Bravo, talismanOfFeatherfootYellow).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
