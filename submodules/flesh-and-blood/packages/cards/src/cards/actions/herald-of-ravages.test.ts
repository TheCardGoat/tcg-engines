import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pulseOfIsenloftBlue } from "../defense-reactions/pulse-of-isenloft.ts";
import { snatchRed } from "./snatch.ts";

import { heraldOfRavagesRed } from "./herald-of-ravages.ts";

/**
 * Herald of Ravages (MON017) — Red cost 2, 7{p}/3{d}. Phantasm.
 * When this hits, put it into soul and deal 1 arcane damage to target hero.
 */

describe("Herald of Ravages (MON017) AAA", () => {
  it("happy: when this hits, soul this and deal 1 arcane to the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfRavagesRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfRavagesRed);
    game.closeCombat({ entityTargets: "pause" });
    Prism.target(Dash);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(12);
    expectFabCard(Prism, heraldOfRavagesRed).toBeIn("soul");
  });

  it("boundary: a blocked miss does not soul this or deal arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfRavagesRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, snatchRed, pulseOfIsenloftBlue],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfRavagesRed);
    Dash.defendWith(nimblismBlue, snatchRed);
    game.toReaction("defender");
    Dash.play(pulseOfIsenloftBlue);
    game.closeCombat();

    expectFabCard(Prism, heraldOfRavagesRed).toBeIn("graveyard");
  });

  it("timing: this stays on the chain until the hit resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfRavagesRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(heraldOfRavagesRed);
    expectFabCard(Prism, heraldOfRavagesRed).toBeIn("combatChain");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
