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
import { bellonaArchangelOfWar } from "./bellona-archangel-of-war.ts";

/**
 * Bellona, Archangel of War (DTD012) — Light Angel Ally 4{p}/4{h}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack
 *   When Bellona attacks, you may banish a card from your hero's soul. If you do,
 *   put a +1{p} counter on each Angel you control.
 *   Ward 4
 */

describe("Bellona, Archangel of War (DTD012) AAA", () => {
  it("happy: attacking with soul banish would put +1{p} counters on Angels", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [bellonaArchangelOfWar],
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

    Prism.activateAttack(bellonaArchangelOfWar, { optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Prism, nimblismBlue).toBeIn("banished");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: declining soul banish leaves Angels at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [bellonaArchangelOfWar],
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

    Prism.activateAttack(bellonaArchangelOfWar, { stopAt: "on-attack" });
    Prism.decline();
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Prism, nimblismBlue).toBeIn("soul");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: once-per-turn Attack cannot activate a second time this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [bellonaArchangelOfWar],
        soul: [nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(bellonaArchangelOfWar, { optionals: "decline" });
    game.closeCombat();

    expect(() => Prism.activateAttack(bellonaArchangelOfWar)).toThrow();
    expectFabCard(Prism, bellonaArchangelOfWar).toBeIn("arena");
  });
});
