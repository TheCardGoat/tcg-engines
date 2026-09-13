import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { rushOfPowerYellow } from "./rush-of-power.ts";
import { runeragerSwarmRed } from "./runerager-swarm.ts";
import { oathOfTheArknightRed } from "./oath-of-the-arknight.ts";

/**
 * Oath of the Arknight (ARC091) — Runeblade Action (red).
 *
 * Printed:
 *   Your next Runeblade attack this turn gains +3{p}.
 *   Create a Runechant token.
 *   Go again
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution abilities generate their effects when the
 *     card-layer resolves), CR 6.2 (layer-continuous modify-numeric bound to
 *     the next matching attack), CR 8.6.3 (Runechant token), CR 2.9 (power),
 *     go again refunds the action point spent.
 *   behaviorConstraints:
 *     - The +3{p} applies only to the controller's NEXT Runeblade attack
 *       THIS TURN; a Generic attack receives nothing and does not consume
 *       the modifier.
 *     - Exactly one Runechant token is created under the controller.
 *     - The modifier is consumed by the first matching Runeblade attack.
 *     - Go again refunds the action point spent to play this.
 *   testImplications:
 *     - Assert the Runechant count is 1 and the action point refunded after
 *       Oath resolves; Rush of Power (Runeblade attack, base 2) reads 5; a
 *       Generic Snatch stays 4 while a later Runeblade attack still reads
 *       5; the second Runeblade attack (Runerager Swarm, base 3) is unbuffed
 *       after the latch was consumed.
 */

describe("oathOfTheArknight family AAA", () => {
  it("happy: creates a Runechant and the next Runeblade attack this turn gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [oathOfTheArknightRed, rushOfPowerYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(oathOfTheArknightRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // One Runechant token was created, and go again refunded the action
    // point spent on the Oath.
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
    expectFabPlayer(Briar).toHaveAP(2);
    expectFabPlayer(Briar).toHaveResourceCount(0);

    Briar.must.playAttack(rushOfPowerYellow);
    game.advanceCombatTo("defend");
    // Rush of Power base 2 + 3 from the Oath = 5.
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a Generic attack gets nothing and does not consume the modifier", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [oathOfTheArknightRed, snatchRed, rushOfPowerYellow],
        resourcePoints: 2,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(oathOfTheArknightRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    Briar.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    // Snatch is Generic: base 4, no +3.
    expectCombat(game).toHaveAttackPower(4);

    // Answer the Runechant's pending trigger ordering (CR 8.6.3: the attack
    // action play burns it) before opening the next link.
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
    Briar.must.playAttack(rushOfPowerYellow);
    game.advanceCombatTo("defend");
    // The modifier waited for a RUNEBLADE attack: 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: the modifier is consumed by the first Runeblade attack", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [oathOfTheArknightRed, rushOfPowerYellow, runeragerSwarmRed],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(oathOfTheArknightRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    Briar.must.playAttack(rushOfPowerYellow);
    game.advanceCombatTo("defend");
    // First Runeblade attack: 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);

    // Answer the Runechant's pending trigger ordering (CR 8.6.3: the attack
    // action play burns it) before opening the next link.
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
    Briar.must.playAttack(runeragerSwarmRed);
    game.advanceCombatTo("defend");
    // "Your NEXT ..." was consumed: Runerager Swarm is its base 3.
    expectCombat(game).toHaveAttackPower(3);
  });
});
