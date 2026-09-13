import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { surayaArchangelOfErudition } from "./suraya-archangel-of-erudition.ts";

/**
 * Suraya, Archangel of Erudition (DTD005) — Light Angel Ally 4{p}/4{h}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack
 *   When Suraya attacks, you may banish a card from your hero's soul. If you do, draw 2 cards.
 *   Ward 4
 */

describe("Suraya, Archangel of Erudition (DTD005) AAA", () => {
  it("happy: attacking with soul banish draws 2", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [surayaArchangelOfErudition],
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

    Prism.activateAttack(surayaArchangelOfErudition, {
      optionals: "accept",
      entityTargets: "minimum",
    });
    expectCombat(game).toHaveAttackPower(4);

    expectFabCard(Prism, nimblismBlue).toBeIn("banished");
    expectFabPlayer(Prism).toHaveHandCount(2);
  });

  it("boundary: declining soul banish draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [surayaArchangelOfErudition],
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

    Prism.activateAttack(surayaArchangelOfErudition, { optionals: "decline" });

    expectFabCard(Prism, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Prism).toHaveHandCount(0);
  });

  it("timing: once-per-turn Attack cannot activate a second time this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [surayaArchangelOfErudition],
        soul: [nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(surayaArchangelOfErudition, { optionals: "decline" });
    game.closeCombat();

    expect(() => Prism.activateAttack(surayaArchangelOfErudition)).toThrow();
    expectFabCard(Prism, surayaArchangelOfErudition).toBeIn("arena");
  });
});
