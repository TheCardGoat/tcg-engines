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
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { celestialReprimandRed } from "./celestial-reprimand.ts";

describe("Celestial Reprimand (DTD038/039/040) AAA", () => {
  it("happy: the red family member reduces a Herald defender by 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTenacityRed, celestialReprimandRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfTenacityRed);
    Dash.defendWith(snatchRed);
    game.toReaction();
    Prism.play(celestialReprimandRed, {
      targetInstanceId: Dash.cardIn("combatChain", snatchRed).instanceId,
    });
    game.passBoth();

    expectFabCard(Dash, snatchRed).toHavePower(1);
    expectCombat(game).toBeOpen();
  });

  it("boundary: a defender against a non-Herald attack is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [snatchRed, celestialReprimandRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(snatchRed);
    Dash.defendWith(brutalAssaultBlue);
    game.toReaction();

    expectFabUnplayable(() => Prism.play(celestialReprimandRed));
    expectFabCard(Dash, brutalAssaultBlue).toHavePower(4);
  });

  it("timing: the reduction expires when the combat chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTenacityRed, celestialReprimandRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfTenacityRed);
    Dash.defendWith(snatchRed);
    game.toReaction();
    Prism.play(celestialReprimandRed, {
      targetInstanceId: Dash.cardIn("combatChain", snatchRed).instanceId,
    });
    game.helpers.resolveRestOfCombat();

    expectCombat(game).toBeClosed();
    expectFabCard(Dash, snatchRed).toHavePower(4);
  });
});
