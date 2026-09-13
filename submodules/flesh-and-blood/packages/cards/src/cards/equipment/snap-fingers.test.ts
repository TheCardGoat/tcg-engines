import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { auroraEmissaryOfLightning } from "../heroes/aurora-emissary-of-lightning.ts";
import { skyzykRed } from "../actions/skyzyk.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { snapFingers } from "./snap-fingers.ts";

/**
 * Snap Fingers (OMN050) — Lightning Runeblade Arms d0 Arcane 1.
 *
 * Printed: Instant - {r}, destroy this: Target Lightning attack action card
 * you control on the active chain link deals 1 arcane damage to the
 * defending hero.
 *
 * Attacker-reaction instant idiom: activate during the chain link with a
 * Lightning attack on chain; the arcane ping lands on top of combat damage.
 * Without a Lightning attacker on chain there is no legal source.
 */

describe("Snap Fingers (OMN050) AAA", () => {
  it("happy: the Lightning attacker deals 1 arcane on top of combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        arms: [snapFingers],
        hand: [skyzykRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);
    const Dash = game.as(dash);

    Aurora.playAttack(skyzykRed);
    expectCombat(game).toHaveAttackPower(3);
    game.toReaction("attacker");
    Aurora.activate(snapFingers);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Aurora, snapFingers).toBeIn("graveyard");
    expectFabPlayer(Aurora).toHaveResourceCount(0);
    // 1 arcane ping plus 3 combat damage.
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: without the arms the same attack deals only combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        hand: [skyzykRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);
    const Dash = game.as(dash);

    Aurora.playAttack(skyzykRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("timing: a non-Lightning attacker is not a legal source", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        arms: [snapFingers],
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 7,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);
    const Dash = game.as(dash);

    Aurora.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(6);
    game.toReaction("attacker");
    Aurora.expectActivationRejected(snapFingers);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Aurora, snapFingers).toBeIn("arms");
  });
});
