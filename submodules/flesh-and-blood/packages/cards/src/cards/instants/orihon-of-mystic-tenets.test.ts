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
import { orihonOfMysticTenetsBlue } from "./orihon-of-mystic-tenets.ts";

/**
 * Orihon of Mystic Tenets, Blue (MST080) — Mystic Instant, cost 4.
 *
 * Printed: "Draw 2 cards. If a Chi was pitched to play this, instead draw 3
 * cards." Legendary.
 */

describe("Orihon of Mystic Tenets (MST080) AAA", () => {
  it("happy: pitching a Chi draws 3 instead of 2", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [orihonOfMysticTenetsBlue, innerChiBlue],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(orihonOfMysticTenetsBlue, { pitch: [innerChiBlue] });
    game.untilIdle({ optionals: "decline" });
    expectFabPlayer(Enigma).toHaveHandCount(3);
    expectFabCard(Enigma, innerChiBlue).toBeIn("pitch");
  });

  it("boundary: without a Chi pitch, draw 2", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [orihonOfMysticTenetsBlue],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(orihonOfMysticTenetsBlue);
    game.untilIdle({ optionals: "decline" });
    expectFabPlayer(Enigma).toHaveHandCount(2);
  });

  it("timing: Instant play on the opponent's attack still draws 2 without Chi", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        hand: [orihonOfMysticTenetsBlue],
        resourcePoints: 4,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Enigma.play(orihonOfMysticTenetsBlue);
    game.passBoth();
    expectFabPlayer(Enigma).toHaveHandCount(2);
    expectCombat(game).toHaveAttackPower(4);
  });
});
