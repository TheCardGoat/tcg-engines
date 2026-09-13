import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { heraldOfTenacityRed } from "../actions/herald-of-tenacity.ts";
import { snatchRed } from "../actions/snatch.ts";
import { angelicWrathRed } from "./angelic-wrath.ts";

describe("Angelic Wrath (DTD035/036/037) AAA", () => {
  it("happy: the red family member gives a Herald attack +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTenacityRed, angelicWrathRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfTenacityRed);
    Dash.pass();
    Prism.play(angelicWrathRed, {
      targetInstanceId: Prism.cardIn("combatChain", heraldOfTenacityRed).instanceId,
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(10);
  });

  it("boundary: a non-Herald attack action is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [snatchRed, angelicWrathRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(snatchRed);
    Dash.pass();
    expectFabUnplayable(() => Prism.play(angelicWrathRed));
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the bonus stays on its targeted Herald attack only", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTenacityRed, angelicWrathRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfTenacityRed);
    Dash.pass();
    Prism.play(angelicWrathRed, {
      targetInstanceId: Prism.cardIn("combatChain", heraldOfTenacityRed).instanceId,
    });
    game.helpers.resolveRestOfCombat();

    Prism.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Prism, heraldOfTenacityRed).toHaveDefense(3);
  });
});
