import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { snatchRed } from "./snatch.ts";
import { flamebornRetributionRed } from "./flameborn-retribution.ts";

/**
 * Flameborn Retribution, Red (FAI013) — Draconic Attack, 1-cost 3{p}/2{d}, go again.
 * Printed: When you defend with Flameborn Retribution, if you've been dealt
 * damage this turn, you may return a Phoenix Flame from your graveyard to your hand.
 */

describe("Flameborn Retribution (FAI013) AAA", () => {
  it("happy: after being dealt damage this turn, defending may return Phoenix Flame", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: fai,
        hand: [flamebornRetributionRed],
        graveyard: [phoenixFlameRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Fai = game.as(fai);

    Bravo.attackWith(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Fai).toHaveLife(16);

    Bravo.attackWith(snatchRed);
    Fai.defendWith(flamebornRetributionRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Fai.target(phoenixFlameRed);

    expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");
  });

  it("boundary: without damage this turn, defending does not return Phoenix Flame", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: fai,
        hand: [flamebornRetributionRed],
        graveyard: [phoenixFlameRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    game.as(bravo).attackWith(snatchRed);
    Fai.defendWith(flamebornRetributionRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
    expectFabPlayer(Fai).toHaveLife(18);
  });

  it("timing: declining the optional leaves Phoenix Flame in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: fai,
        hand: [flamebornRetributionRed],
        graveyard: [phoenixFlameRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Fai = game.as(fai);

    Bravo.attackWith(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Bravo.attackWith(snatchRed);
    Fai.defendWith(flamebornRetributionRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
  });
});
