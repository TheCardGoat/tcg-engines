import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { homageToAncestorsBlue } from "../instants/homage-to-ancestors.ts";
import { biteBlue } from "../actions/bite.ts";
import { nuu } from "../heroes/nuu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tideChakraRed } from "./tide-chakra.ts";

/**
 * Tide Chakra, Red (MST011) — Mystic Assassin Attack Reaction, cost 1, 3{d}.
 *
 * Printed: "Target Assassin or Mystic attack action card gets +3{p}. If
 * you've transcended this turn, instead it gets +5{p}."
 */

describe("Tide Chakra (MST011) AAA", () => {
  it("happy: target Assassin attack action card gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [biteBlue, tideChakraRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.playAttack(biteBlue);
    game.advanceUntil({ stopAt: "reaction", optionals: "decline" });
    Nuu.must.playReaction(tideChakraRed);
    game.passBoth();

    // Bite printed 1 + 3 = 4.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Nuu, tideChakraRed).toBeIn("graveyard");
  });

  it("boundary: Generic Snatch is not a legal Assassin/Mystic AAC (silent no-op)", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [snatchRed, tideChakraRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.must.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "reaction" });
    expectFabUnplayable(() => Nuu.must.playReaction(tideChakraRed));

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Nuu, tideChakraRed).toBeIn("hand");
  });

  it("timing: transcended this turn instead gives +5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [biteBlue, homageToAncestorsBlue, tideChakraRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.playAttack(biteBlue);
    game.advanceUntil({ stopAt: "reaction", optionals: "decline" });
    Nuu.play(homageToAncestorsBlue);
    game.passBoth();
    Nuu.must.playReaction(tideChakraRed);
    game.passBoth();

    // Bite printed 1 + 5 = 6.
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Nuu, tideChakraRed).toBeIn("graveyard");
  });
});
