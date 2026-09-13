import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { fyendalSSpringTunic } from "../equipment/fyendal-s-spring-tunic.ts";
import { kimonoOfLayeredLessons } from "../equipment/kimono-of-layered-lessons.ts";
import { recedeToMistformBlue } from "./recede-to-mistform.ts";

/**
 * Recede to Mistform (PEN268) — Mystic Instant, cost X.
 *
 * Printed: Choose X equipment with cloaked you have equipped. Turn them face-down.
 *
 * Choose-card scans equipped seats; X=0 is an empty parameter set (CR 1.8.6).
 */

describe("Recede to Mistform (PEN268) AAA", () => {
  it("happy: X=1 turns a face-up cloaked equipment face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [recedeToMistformBlue],
        chest: [{ card: kimonoOfLayeredLessons, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(recedeToMistformBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });
    expectFabCard(Enigma, kimonoOfLayeredLessons).toBeIn("chest");
    expectFabCard(Enigma, kimonoOfLayeredLessons).toBeFaceDown();
    expectFabCard(Enigma, recedeToMistformBlue).toBeIn("graveyard");
  });

  it("boundary: X=0 chooses no equipment and the kimono stays face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [recedeToMistformBlue],
        chest: [{ card: kimonoOfLayeredLessons, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(recedeToMistformBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabCard(Enigma, recedeToMistformBlue).toBeIn("graveyard");
    expectFabCard(Enigma, kimonoOfLayeredLessons).toBeFaceUp();
  });

  it("timing: non-cloaked equipment is not a legal choice and stays face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [recedeToMistformBlue],
        chest: [fyendalSSpringTunic],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(recedeToMistformBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });
    expectFabCard(Enigma, fyendalSSpringTunic).toBeIn("chest");
    expectFabCard(Enigma, fyendalSSpringTunic).toBeFaceUp();
  });
});
