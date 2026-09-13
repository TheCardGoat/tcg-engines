import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { cosmicAwakeningBlue } from "./cosmic-awakening.ts";

/**
 * Cosmic Awakening (MST076) — If 1/2/3+ Chi were pitched to play this,
 * {p} is 10/15/20. The paid count is stamped on this card's play incarnation.
 */

describe("Cosmic Awakening (MST076) AAA", () => {
  it("happy: pitching 1 Chi to play this sets {p} to 10", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [cosmicAwakeningBlue, innerChiBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.playAttack(cosmicAwakeningBlue, { pitch: [innerChiBlue] });
    expectCombat(game).toHaveAttackPower(10);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(10);
  });

  it("boundary: pitching 3 Chi to play this sets {p} to 20", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [cosmicAwakeningBlue, innerChiBlue, innerChiBlue, innerChiBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.playAttack(cosmicAwakeningBlue, {
      pitch: [innerChiBlue, innerChiBlue, innerChiBlue],
    });
    expectCombat(game).toHaveAttackPower(20);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(0);
  });

  it("boundary: pitching 2 Chi to play this sets {p} to 15", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [cosmicAwakeningBlue, innerChiBlue, innerChiBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(enigma).playAttack(cosmicAwakeningBlue, {
      pitch: [innerChiBlue, innerChiBlue],
    });

    expectCombat(game).toHaveAttackPower(15);
  });

  it("timing: paying with resources only leaves this without the Chi power", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [cosmicAwakeningBlue],
        resourcePoints: 9,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.playAttack(cosmicAwakeningBlue);
    expectCombat(game).toHaveAttackPower(0);
    expectFabCard(Enigma, cosmicAwakeningBlue).toBeIn("combatChain");
  });
});
