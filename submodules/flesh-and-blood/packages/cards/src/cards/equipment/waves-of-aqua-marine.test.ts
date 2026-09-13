import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { snatchRed } from "../actions/snatch.ts";
import { wavesOfAquaMarine } from "./waves-of-aqua-marine.ts";

/**
 * Waves of Aqua Marine (LGS276) — Mystic Equipment - Arms.
 *
 * Printed: Cloaked. Attack Reaction - {r}, turn this face-up: Target attack
 * gets +1{p}. At the start of your turn, destroy this.
 */

describe("Waves of Aqua Marine (LGS276) AAA", () => {
  it("happy: turning this face up as an attack reaction gives the attack +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arms: [wavesOfAquaMarine],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.playAttack(snatchRed);
    game.toReaction("attacker");
    Enigma.activate(wavesOfAquaMarine);
    game.passBoth();

    // Snatch 4{p} + 1{p} from the reaction.
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: once face up the turn-face-up cost is illegal, so no second +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arms: [wavesOfAquaMarine],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.playAttack(snatchRed);
    game.toReaction("attacker");
    Enigma.activate(wavesOfAquaMarine);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);

    Enigma.expectActivationRejected(wavesOfAquaMarine);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: at the start of your turn this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arms: [wavesOfAquaMarine],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    expectFabCard(Enigma, wavesOfAquaMarine).toBeIn("arms");
    Enigma.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Enigma, wavesOfAquaMarine).toBeIn("graveyard");
  });
});
