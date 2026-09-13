import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { cranialCrushBlue } from "../actions/cranial-crush.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { denseBlueMistBlue } from "../instants/dense-blue-mist.ts";
import { bigBlueSkyBlue } from "./big-blue-sky.ts";

/**
 * Big Blue Sky (ENG015) — Defense Reaction. "This gets +1{d} for each blue
 * card you've pitched this turn." Printed 2{d}.
 *
 * Fused-style combat-chain self-static: play the DR after toReaction.
 */

describe("Big Blue Sky (ENG015) AAA", () => {
  it("happy: one blue pitched this turn makes this 3{d} vs 8{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cranialCrushBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: enigma,
        life: 20,
        hand: [bigBlueSkyBlue, denseBlueMistBlue, innerChiBlue],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    game.as(dash).attackWith(cranialCrushBlue);
    game.toReaction("defender");
    Enigma.play(denseBlueMistBlue, { pitch: [innerChiBlue] });
    game.passBoth();
    game.as(dash).pass();
    Enigma.play(bigBlueSkyBlue);
    game.helpers.resolveRestOfCombat();

    // Dense Blue Mist also -1{p} (7 vs 3{d}) → 4 damage.
    expectFabPlayer(Enigma).toHaveLife(16);
    expectFabCard(Enigma, bigBlueSkyBlue).toBeIn("graveyard");
  });

  it("boundary: with no blues pitched this stays printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cranialCrushBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: enigma,
        life: 20,
        hand: [bigBlueSkyBlue],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    game.as(dash).attackWith(cranialCrushBlue);
    game.toReaction("defender");
    Enigma.play(bigBlueSkyBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Enigma).toHaveLife(14); // 20 - (8 - 2)
  });

  it("timing: the +{d} is evaluated on the chain after the DR is played", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cranialCrushBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: enigma,
        life: 20,
        hand: [bigBlueSkyBlue],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    game.as(dash).attackWith(cranialCrushBlue);
    game.toReaction("defender");
    Enigma.play(bigBlueSkyBlue);
    game.passBoth();
    expectFabCard(Enigma, bigBlueSkyBlue).toBeIn("combatChain");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Enigma).toHaveLife(14);
  });
});
