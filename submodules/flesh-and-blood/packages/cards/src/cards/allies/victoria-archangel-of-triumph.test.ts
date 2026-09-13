import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { victoriaArchangelOfTriumph } from "./victoria-archangel-of-triumph.ts";

/**
 * Victoria, Archangel of Triumph (DTD011) — Light Angel Ally 4{p}/4{h}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack
 *   When Victoria attacks, you may banish a card from your hero's soul. If you do,
 *   attack action cards your opponents control get -1{p} until the start of your next turn.
 *   Ward 4
 */

describe("Victoria, Archangel of Triumph (DTD011) AAA", () => {
  it("happy: attacking with soul banish would tax opponent attack actions", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [victoriaArchangelOfTriumph],
        soul: [nimblismBlue],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(victoriaArchangelOfTriumph, {
      optionals: "accept",
      entityTargets: "minimum",
    });
    expectCombat(game).toHaveAttackPower(4);

    expectFabCard(Prism, nimblismBlue).toBeIn("banished");
  });

  it("boundary: declining soul banish leaves soul intact", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [victoriaArchangelOfTriumph],
        soul: [nimblismBlue],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(victoriaArchangelOfTriumph, { optionals: "decline" });

    expectFabCard(Prism, nimblismBlue).toBeIn("soul");
  });

  it("timing: once-per-turn Attack cannot activate a second time this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [victoriaArchangelOfTriumph],
        soul: [nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(victoriaArchangelOfTriumph, { optionals: "decline" });
    game.closeCombat();

    expect(() => Prism.activateAttack(victoriaArchangelOfTriumph)).toThrow();
    expectFabCard(Prism, victoriaArchangelOfTriumph).toBeIn("arena");
  });
});
