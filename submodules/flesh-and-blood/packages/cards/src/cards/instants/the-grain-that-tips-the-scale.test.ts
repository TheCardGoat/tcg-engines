import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { dash } from "../heroes/dash.ts";
import { homageToAncestorsBlue } from "./homage-to-ancestors.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { theGrainThatTipsTheScaleBlue } from "./the-grain-that-tips-the-scale.ts";

/**
 * The Grain that Tips the Scale, Blue (MST102) — Mystic Instant, cost 0.
 * Printed: "Legendary. Target attack gets +1{p}. If you've played another
 * blue card this turn, transcend."
 *
 * Mid-combat Instant (DTD035): playAttack → defender pass → play targeting
 * the combat-chain attack. Transcend returns the Instant to hand (CR 8.5.48).
 */

describe("The Grain that Tips the Scale (MST102) AAA", () => {
  it("happy: after another blue this turn, the targeted attack gets +1{p} and Grain transcends", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [homageToAncestorsBlue, snatchRed, theGrainThatTipsTheScaleBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);
    const Dash = game.as(dash);

    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Enigma.playAttack(snatchRed);
    Dash.pass();
    Enigma.play(theGrainThatTipsTheScaleBlue, {
      targetInstanceId: Enigma.cardIn("combatChain", snatchRed).instanceId,
    });
    game.passBoth();

    // Snatch printed 4{p} + 1 = 5.
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(5);
    expectFabCard(Enigma, theGrainThatTipsTheScaleBlue).toBeIn("hand");
  });

  it("boundary: as the first blue this turn, Grain still grants +1{p} but does not transcend", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [snatchRed, theGrainThatTipsTheScaleBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);
    const Dash = game.as(dash);

    Enigma.playAttack(snatchRed);
    Dash.pass();
    Enigma.play(theGrainThatTipsTheScaleBlue, {
      targetInstanceId: Enigma.cardIn("combatChain", snatchRed).instanceId,
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Enigma, theGrainThatTipsTheScaleBlue).toBeIn("graveyard");
  });

  it("timing: the +1{p} latches on the targeted attack, not a later attack", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [snatchRed, theGrainThatTipsTheScaleBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);
    const Dash = game.as(dash);

    Enigma.playAttack(snatchRed);
    Dash.pass();
    Enigma.play(theGrainThatTipsTheScaleBlue, {
      targetInstanceId: Enigma.cardIn("combatChain", snatchRed).instanceId,
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    Enigma.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });
});
