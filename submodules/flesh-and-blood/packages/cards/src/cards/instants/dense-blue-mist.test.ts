import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { snatchRed } from "../actions/snatch.ts";
import { denseBlueMistBlue } from "./dense-blue-mist.ts";

/**
 * Dense Blue Mist, Blue (MST079) — Mystic Instant, cost 1.
 *
 * Printed: "Attacks that target you this turn get -1{p}.
 * If a Chi was pitched to play this, effects don't trigger if an attack hits you this turn."
 */

describe("Dense Blue Mist (MST079) AAA", () => {
  it("happy: pitching Chi stops the hitting attack's on-hit trigger", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        hand: [denseBlueMistBlue, innerChiBlue],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Enigma.play(denseBlueMistBlue, { pitch: [innerChiBlue] });
    game.passBoth();
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Enigma, innerChiBlue).toBeIn("pitch");
  });

  it("boundary: without a Chi pitch, Snatch still draws on hit", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        hand: [denseBlueMistBlue],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Enigma.play(denseBlueMistBlue);
    game.passBoth();
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveHandCount(1);
  });

  it("timing: as an instant on the chain, attacks targeting you get -1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        hand: [denseBlueMistBlue],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();

    Enigma.play(denseBlueMistBlue);
    game.passBoth();
    expectFabCard(Enigma, denseBlueMistBlue).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(3);
  });
});
