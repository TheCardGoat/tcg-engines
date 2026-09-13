import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { homageToAncestorsBlue } from "./homage-to-ancestors.ts";
import { aDropInTheOceanBlue } from "./a-drop-in-the-ocean.ts";

/**
 * A Drop in the Ocean, Blue (ENG025) — Mystic Instant, cost 0, Legendary.
 * Printed: "Legendary. Target attack gets -1{p}. If you've played another
 * blue card this turn, transcend."
 *
 * Legendary is a deckbuilding restriction (out of 1v1 play scope).
 * Mid-combat instant: playAttack → defender pass → play targeting the
 * combat-chain attack (DTD035).
 */

describe("A Drop in the Ocean (ENG025) AAA", () => {
  it("happy: target attack on the chain gets -1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [snatchRed, aDropInTheOceanBlue],
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
    Enigma.play(aDropInTheOceanBlue, {
      targetInstanceId: Enigma.cardIn("combatChain", snatchRed).instanceId,
    });
    game.passBoth();

    // Snatch printed 4 − 1 = 3.
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(3);
    expectFabCard(Enigma, aDropInTheOceanBlue).toBeIn("graveyard");
  });

  it("boundary: with no attack in play, Drop cannot bind a target and stays in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [aDropInTheOceanBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    expectFabUnplayable(() => Enigma.play(aDropInTheOceanBlue));
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, aDropInTheOceanBlue).toBeIn("hand");
    expectCombat(game).toBeClosed();
  });

  it("timing: after another blue this turn, Drop transcends back to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [homageToAncestorsBlue, snatchRed, aDropInTheOceanBlue],
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
    Enigma.play(aDropInTheOceanBlue, {
      targetInstanceId: Enigma.cardIn("combatChain", snatchRed).instanceId,
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Enigma, aDropInTheOceanBlue).toBeIn("hand");
  });
});
