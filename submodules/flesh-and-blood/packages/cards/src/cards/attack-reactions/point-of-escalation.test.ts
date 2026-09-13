import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { cutNCarveRed } from "../actions/cut-n-carve.ts";
import { andAgainBlue } from "../actions/and-again.ts";
import { snatchRed } from "../actions/snatch.ts";
import { pointOfEscalationYellow } from "./point-of-escalation.ts";

/**
 * Point of Escalation (MPW025) — Warrior Attack Reaction, cost 1, 3{d}.
 *
 * Printed: "Target sword attack gets +2{p} for each time you've attacked
 * with the sword this turn." The declaration of the current attack counts.
 */

describe("Point of Escalation (MPW025) AAA", () => {
  it("happy: the first attack with the sword this turn gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [cutNCarveRed, pointOfEscalationYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(cutNCarveRed); // sharpen the sword (+1{p} counter)
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    Hala.activate(zenithBlade);
    game.toReaction("attacker");
    Hala.must.playReaction(pointOfEscalationYellow);
    game.passBoth();

    // Zenith Blade 3 + 1 sharpen counter + (1 attack this turn x 2) = 6.
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Hala, pointOfEscalationYellow).toBeIn("graveyard");
  });

  it("timing: the sword's second attack this turn gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [cutNCarveRed, andAgainBlue, pointOfEscalationYellow],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(cutNCarveRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    Hala.activate(zenithBlade);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(16); // 3 + 1 sharpen

    // Attack again with the same sharpened sword via And Again...
    Hala.play(andAgainBlue, {
      target: Hala.cardIn("weapon1", zenithBlade).instanceId,
    });
    game.toReaction("attacker");
    Hala.must.playReaction(pointOfEscalationYellow);
    game.passBoth();

    // Zenith Blade 3 + 1 sharpen + (2 attacks this turn x 2) = 8.
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: a non-sword attack is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed, pointOfEscalationYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.playAttack(snatchRed);
    game.toReaction("attacker");

    expectFabUnplayable(() => Kassai.must.playReaction(pointOfEscalationYellow));
    expectFabCard(Kassai, pointOfEscalationYellow).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });
});
