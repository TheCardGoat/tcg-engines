import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { snatchRed } from "../actions/snatch.ts";
import {
  displayOfCraftsmanshipBlue,
  displayOfCraftsmanshipRed,
  displayOfCraftsmanshipYellow,
} from "./display-of-craftsmanship.ts";

/**
 * Display of Craftsmanship — Warrior Attack Reaction, cost 2.
 *
 * Printed: Target weapon attack gets the pitch-scaled power bonus. If the
 * weapon has been sharpened this turn, put a +1{p} counter on it.
 */

function startReactionGame(reaction: typeof displayOfCraftsmanshipRed) {
  return FabTestEngine.start(
    {
      hero: halaBladesaintOfTheVow,
      weapon1: [zenithBlade],
      hand: [reaction],
      resourcePoints: 6,
      actionPoints: 2,
      deck: 6,
    },
    { hero: dash, hand: [], life: 20, deck: 6 },
    FAB_MANUAL_HARNESS,
  );
}

describe("display-of-craftsmanship family AAA", () => {
  it("happy: red boosts a sharpened weapon and adds a counter", () => {
    const game = startReactionGame(displayOfCraftsmanshipRed);
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.activate(halaBladesaintOfTheVow);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: zenithBlade.canonicalId,
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: false,
    });
    Hala.must.activate(zenithBlade);
    game.advanceCombatTo("reaction");
    Hala.must.playReaction(displayOfCraftsmanshipRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(9);
    expectFabCard(Hala, zenithBlade).toHaveCounters(2);
  });

  it("happy: yellow and blue preserve their printed pitch-scaled boosts", () => {
    for (const [reaction, expected] of [
      [displayOfCraftsmanshipYellow, 8],
      [displayOfCraftsmanshipBlue, 7],
    ] as const) {
      const game = startReactionGame(reaction);
      const Hala = game.as(halaBladesaintOfTheVow);

      Hala.activate(halaBladesaintOfTheVow);
      game.helpers.resolveUntilIdle({
        entityTargetCanonicalId: zenithBlade.canonicalId,
        entityTargets: "minimum",
        ordering: "listed",
        optionalBoolean: false,
      });
      Hala.must.activate(zenithBlade);
      game.advanceCombatTo("reaction");
      Hala.must.playReaction(reaction);
      game.passBoth();

      expectCombat(game).toHaveAttackPower(expected);
      expectFabCard(Hala, zenithBlade).toHaveCounters(2);
    }
  });

  it("boundary: an unsharpened weapon gets only the printed boost", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [displayOfCraftsmanshipRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.activate(zenithBlade);
    game.advanceCombatTo("reaction");
    Hala.must.playReaction(displayOfCraftsmanshipRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Hala, zenithBlade).toHaveCounters(0);
    expectFabPlayer(Hala).toHaveResourceCount(0);
  });

  it("timing: it is legal only against a weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        hand: [displayOfCraftsmanshipRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Hala.must.playReaction(displayOfCraftsmanshipRed));
    expectFabCard(Hala, displayOfCraftsmanshipRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });
});
