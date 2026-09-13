import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { metisArchangelOfTenacity } from "./metis-archangel-of-tenacity.ts";

/**
 * Metis, Archangel of Tenacity (DTD010) — Light Angel Ally 4{p}/4{h}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack
 *   When Metis attacks, you may banish a card from your hero's soul. If you do,
 *   your attacks this turn get dominate.
 *   Ward 4
 */

describe("Metis, Archangel of Tenacity (DTD010) AAA", () => {
  it("happy: soul banish grants dominate to this attack", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [metisArchangelOfTenacity],
        soul: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(metisArchangelOfTenacity, {
      optionals: "accept",
      entityTargets: "minimum",
    });
    expectCombat(game).toHaveAttackPower(4);

    expectFabCard(Prism, nimblismBlue).toBeIn("banished");
  });

  it("boundary: declining soul banish does not grant dominate from the trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [metisArchangelOfTenacity],
        soul: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(metisArchangelOfTenacity, { optionals: "decline" });

    expectFabCard(Prism, nimblismBlue).toBeIn("soul");
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("timing: soul banish makes a later attack this turn dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [metisArchangelOfTenacity],
        soul: [nimblismBlue],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(metisArchangelOfTenacity, {
      optionals: "accept",
      entityTargets: "minimum",
    });
    game.closeCombat({ optionals: "accept" });
    Prism.playAttack(snatchRed);

    expectCombat(game).toHaveKeyword("dominate");
  });
});
