import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { koiBlessedKimono } from "./koi-blessed-kimono.ts";

/**
 * Koi Blessed Kimono — Mystic Chest, Cloaked.
 *
 * Printed: "Cloaked / While this is equipped face-down, at the start of your
 * turn, if you have exactly 1{h}, you may turn this face-up. / When this is
 * turned face-up, destroy it. Search your deck for an Inner Chi, reveal it,
 * put it into your hand, then shuffle."
 */

describe("Koi Blessed Kimono AAA", () => {
  it("happy: at exactly 1{h} the face-down kimono turns up, dies, and tutors an Inner Chi", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [], life: 20, deck: 6 },
      {
        hero: enigma,
        chest: [koiBlessedKimono],
        hand: [],
        life: 1,
        deck: [innerChiBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: blazeFiremind },
    );
    const Enigma = game.as(enigma);
    const Blaze = game.as(blazeFiremind);

    // Enigma's start phase opens the 1{h} optional right after Blaze's turn.
    Blaze.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    game.passBoth(); // resolve the trigger: destroy + search

    expectFabCard(Enigma, koiBlessedKimono).toBeIn("graveyard");
    expectFabCard(Enigma, innerChiBlue).toBeIn("hand");
  });

  it("boundary: at any life other than exactly 1{h} the kimono stays face down", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [], life: 20, deck: 6 },
      {
        hero: enigma,
        chest: [koiBlessedKimono],
        hand: [],
        life: 2,
        deck: [innerChiBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: blazeFiremind },
    );
    const Enigma = game.as(enigma);
    const Blaze = game.as(blazeFiremind);

    // At 2{h} the start-phase trigger never opens an optional, so the
    // kimono never turns face up.
    Blaze.endTurn();

    expectFabCard(Enigma, koiBlessedKimono).toBeIn("chest");
    expectFabCard(Enigma, koiBlessedKimono).toBeFaceDown();
  });
});
