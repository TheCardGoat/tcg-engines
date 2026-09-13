import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { leviaShadowbornAbomination } from "../heroes/levia-shadowborn-abomination.ts";
import { spewShadowRed } from "../actions/spew-shadow.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { blasmophetTheSoulHarvester } from "./blasmophet-the-soul-harvester.ts";

/**
 * Blasmophet, the Soul Harvester (MON219) — Shadow Token Demon Ally 6{p}/6{h}.
 *
 * Printed:
 *   Once per Turn Action - 0: Attack
 *   Whenever Blasmophet attacks, you may banish a Shadow card from your hand.
 *   If you do, you may banish a card from the defending hero's soul.
 */

describe("Blasmophet, the Soul Harvester (MON219) AAA", () => {
  it("happy: attacking would open the Shadow-hand banish then defending soul", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        arena: [blasmophetTheSoulHarvester],
        hand: [spewShadowRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], soul: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.activateAttack(blasmophetTheSoulHarvester, {
      optionals: "accept",
      entityTargets: "minimum",
    });
    expectCombat(game).toHaveAttackPower(6);

    expectFabCard(Levia, spewShadowRed).toBeIn("banished");
    expectFabCard(game.as(dash), nimblismBlue).toBeIn("banished");
  });

  it("boundary: without a Shadow card in hand the defending soul is safe", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        arena: [blasmophetTheSoulHarvester],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], soul: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.activateAttack(blasmophetTheSoulHarvester, { optionals: "decline" });

    expectFabCard(game.as(dash), nimblismBlue).toBeIn("soul");
  });

  it("timing: once-per-turn Attack cannot activate a second time this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        arena: [blasmophetTheSoulHarvester],
        hand: [spewShadowRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], soul: [nimblismBlue], deck: 6 },
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.activateAttack(blasmophetTheSoulHarvester, { optionals: "decline" });
    game.closeCombat();

    expect(() => Levia.activateAttack(blasmophetTheSoulHarvester)).toThrow();
    expectFabCard(Levia, blasmophetTheSoulHarvester).toBeIn("arena");
  });
});
