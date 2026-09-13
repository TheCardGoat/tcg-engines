import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { headJabYellow } from "../actions/head-jab.ts";
import { kimonoOfLayeredLessons } from "./kimono-of-layered-lessons.ts";

/**
 * Kimono of Layered Lessons — Mystic Chest d1, Cloaked.
 *
 * Printed: "Cloaked / Instant - {c}{c}{c}, turn this face-up: Put a +1{d}
 * counter on this. / At the start of your turn, destroy this."
 */

describe("Kimono of Layered Lessons AAA", () => {
  it("happy: paying 3 chi turns the kimono face up and puts a +1{d} counter on it", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        chest: [kimonoOfLayeredLessons],
        chiPoints: 3,
        life: 20,
        hand: [],
        deck: 6,
      },
      { hero: blazeFiremind, hand: [headJabYellow], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.activate(kimonoOfLayeredLessons);
    game.passBoth(); // resolve the Instant layer

    expectFabCard(Enigma, kimonoOfLayeredLessons).toHaveDefenseCounters(1);
    expectFabCard(Enigma, kimonoOfLayeredLessons).toBeIn("chest");
  });

  it("boundary: with only 2 chi the Instant cannot be activated and the kimono stays face down", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        chest: [kimonoOfLayeredLessons],
        chiPoints: 2,
        life: 20,
        hand: [],
        deck: 6,
      },
      { hero: blazeFiremind, hand: [headJabYellow], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.expectActivationRejected(kimonoOfLayeredLessons);
    expectFabCard(Enigma, kimonoOfLayeredLessons).toBeIn("chest");
    expectFabCard(Enigma, kimonoOfLayeredLessons).toBeFaceDown();
  });

  it("timing: the kimono is destroyed at the start of its controller's next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        chest: [kimonoOfLayeredLessons],
        chiPoints: 3,
        life: 20,
        hand: [],
        deck: 6,
      },
      { hero: blazeFiremind, hand: [headJabYellow], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);
    const Blaze = game.as(blazeFiremind);

    Enigma.activate(kimonoOfLayeredLessons);
    game.passBoth(); // resolve the Instant layer
    Enigma.endTurn();
    game.helpers.resolveUntilIdle();
    Blaze.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, kimonoOfLayeredLessons).toBeIn("graveyard");
  });
});
