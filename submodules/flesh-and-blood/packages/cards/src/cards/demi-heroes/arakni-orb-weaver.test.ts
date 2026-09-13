import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { markOfTheBlackWidowRed } from "../actions/mark-of-the-black-widow.ts";
import { grapheneChelicera } from "../weapons/graphene-chelicera.ts";
import { arakniOrbWeaver } from "./arakni-orb-weaver.ts";

/**
 * Arakni, Orb-Weaver (HNT005) — Chaos Assassin Demi-Hero (Agent).
 *
 * Printed:
 *   Graphene Chelicerae cost you {r} less to activate.
 *   Once per Turn Instant - Discard an Assassin card: Equip a Graphene
 *   Chelicera token. Your next attack with stealth this turn gets +3{p}.
 *   At the beginning of your end phase, return to the brood.
 */

describe("Arakni, Orb-Weaver (HNT005) AAA", () => {
  it("happy: discarding an Assassin equips a Chelicera and the next stealth attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arena: [arakniOrbWeaver],
        hand: [markOfTheBlackWidowRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.activate(arakniOrbWeaver);
    game.untilIdle();
    expectFabToken(game, "graphene-chelicera").toHaveCount(1).toBeIn("weapon1");
    expectFabCard(Arakni, markOfTheBlackWidowRed).toBeIn("graveyard");

    Arakni.activateAttack("token:graphene-chelicera");
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("stealth");
  });

  it("happy: the Agent discounts Graphene Chelicerae to {r} 0", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arena: [arakniOrbWeaver],
        weapon1: [grapheneChelicera],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.activateAttack(grapheneChelicera);
    expectFabPlayer(Arakni).toHaveResourceCount(1);
    expectCombat(game).toHaveAttackPower(1);
    expectCombat(game).toHaveKeyword("stealth");
  });

  it("boundary: without the Agent, Graphene Chelicerae cost their full {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [grapheneChelicera],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.activateAttack(grapheneChelicera);
    expectFabPlayer(Arakni).toHaveResourceCount(0);
    expectCombat(game).toHaveAttackPower(1);
  });

  it("timing: a non-stealth attack does not get the +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arena: [arakniOrbWeaver],
        hand: [markOfTheBlackWidowRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.activate(arakniOrbWeaver);
    game.untilIdle();
    Arakni.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("stealth");
  });
});
