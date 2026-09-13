import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { homageToAncestorsBlue } from "../instants/homage-to-ancestors.ts";
import { whisperingMistBlue } from "../instants/whispering-mist.ts";
import { zen } from "../heroes/zen.ts";
import { snatchRed } from "./snatch.ts";
import { windChakraRed } from "./wind-chakra.ts";

/**
 * Wind Chakra, Red (MST054) — Mystic Ninja Action, cost 0, 3{d}, go again.
 *
 * Printed: "The next Crouching Tiger you play this turn gets +3{p}. If
 * you've transcended this turn, instead it gets +5{p}."
 */

describe("Wind Chakra (MST054) AAA", () => {
  it("happy: the next Crouching Tiger you play this turn gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [windChakraRed, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(windChakraRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Zen).toHaveAP(1);
    Zen.playAttack(crouchingTiger);

    // Crouching Tiger printed 0 + 3 = 3.
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(3);
    expectFabCard(Zen, windChakraRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack is not a Crouching Tiger and stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [windChakraRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(windChakraRed);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(snatchRed);

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
  });

  it("timing: transcended this turn instead gives +5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [whisperingMistBlue, homageToAncestorsBlue, windChakraRed, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(whisperingMistBlue);
    game.helpers.resolveUntilIdle();
    Zen.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Zen.play(windChakraRed);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(crouchingTiger);

    // Crouching Tiger printed 0 + Wind Chakra 5 + Whispering Mist ephemeral +1.
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(6);
  });
});
