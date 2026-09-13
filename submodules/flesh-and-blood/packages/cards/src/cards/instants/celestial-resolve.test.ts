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

import { celestialResolveRed } from "./celestial-resolve.ts";

describe("Celestial Resolve (DTD041/042/043) AAA", () => {
  it("happy: the red family member gives a Herald attack +5{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTenacityRed, celestialResolveRed],
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
    Prism.play(celestialResolveRed, {
      targetInstanceId: Prism.cardIn("combatChain", heraldOfTenacityRed).instanceId,
    });
    game.passBoth();

    expectFabCard(Prism, heraldOfTenacityRed).toHaveDefense(8);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a non-Herald attack action is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [snatchRed, celestialResolveRed],
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
    expectFabUnplayable(() => Prism.play(celestialResolveRed));
    expectFabCard(Prism, snatchRed).toHaveDefense(2);
  });

  it("timing: the defense bonus does not change the attack power", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTenacityRed, celestialResolveRed],
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
    Prism.play(celestialResolveRed, {
      targetInstanceId: Prism.cardIn("combatChain", heraldOfTenacityRed).instanceId,
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Prism, heraldOfTenacityRed).toHaveDefense(8);
  });
});
