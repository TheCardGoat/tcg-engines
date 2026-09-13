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
import { snatchRed } from "../actions/snatch.ts";
import { themisArchangelOfJudgment } from "./themis-archangel-of-judgment.ts";

/**
 * Themis, Archangel of Judgment (DTD006) — Light Angel Ally 4{p}/4{h}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack
 *   When Themis attacks, you may banish a card from your hero's soul. If you do,
 *   turn a card in any banished zone face-down.
 *   Ward 4
 */

describe("Themis, Archangel of Judgment (DTD006) AAA", () => {
  it("happy: soul banish then turns a banished card face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [themisArchangelOfJudgment],
        soul: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        banished: [{ card: snatchRed, state: { faceDown: false } }],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);
    const _Dash = game.as(dash);

    Prism.activateAttack(themisArchangelOfJudgment, {
      optionals: "accept",
      entityTargets: "minimum",
    });
    expectCombat(game).toHaveAttackPower(4);

    expectFabCard(Prism, nimblismBlue).toBeIn("banished");
  });

  it("boundary: declining soul banish leaves the public banished card face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [themisArchangelOfJudgment],
        soul: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        banished: [{ card: snatchRed, state: { faceDown: false } }],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);
    const Dash = game.as(dash);

    Prism.activateAttack(themisArchangelOfJudgment, { optionals: "decline" });

    expectFabCard(Prism, nimblismBlue).toBeIn("soul");
    expectFabCard(Dash, snatchRed).toBeBanished();
  });

  it("timing: once-per-turn Attack cannot activate a second time this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [themisArchangelOfJudgment],
        soul: [nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(themisArchangelOfJudgment, { optionals: "decline" });
    game.closeCombat();

    expect(() => Prism.activateAttack(themisArchangelOfJudgment)).toThrow();
    expectFabCard(Prism, themisArchangelOfJudgment).toBeIn("arena");
  });
});
