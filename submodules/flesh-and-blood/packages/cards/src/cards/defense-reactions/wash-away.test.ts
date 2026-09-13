import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { dash } from "../heroes/dash.ts";
import { homageToAncestorsBlue } from "../instants/homage-to-ancestors.ts";
import { snatchRed } from "../actions/snatch.ts";
import { washAwayBlue } from "./wash-away.ts";

/**
 * Wash Away, Blue (MST091) — Mystic Defense Reaction, cost 2, 3{d}.
 * Printed: "If you've played another blue card this turn, this gets +2{d}."
 *
 * `played-another-blue-card-this-turn` is handled. Homage to Ancestors is the
 * same-turn blue vehicle, playable as an Instant in the reaction window.
 */

describe("Wash Away (MST091) AAA", () => {
  it("happy: after another blue card this turn, Wash Away is 5{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        hand: [homageToAncestorsBlue, washAwayBlue],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    game.helpers.passPriorityTo(Enigma);
    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Enigma.play(washAwayBlue);
    game.passBoth();

    expectFabCard(Enigma, washAwayBlue).toHaveDefense(5);
  });

  it("boundary: as the first blue card this turn, Wash Away stays at printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: enigma, hand: [washAwayBlue], resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Enigma.play(washAwayBlue);

    expectFabCard(Enigma, washAwayBlue).toHaveDefense(3);
  });

  it("timing: cannot play Wash Away outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: enigma, hand: [washAwayBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(enigma).play(washAwayBlue),
      /not legal in the current reaction step/i,
    );
    expectFabCard(game.as(enigma), washAwayBlue).toBeIn("hand");
  });
});
