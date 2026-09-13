import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { marked } from "./marked.ts";

/**
 * Marked (CIN029) — CR 9.3 condition face, not a playable card.
 *
 * Printed: "You are marked until an opponent hits you"
 *
 * Plan §5 OUT_OF_SCOPE: no independently playable abilities. The public
 * lifecycle is the hero `marked` flag (`expectFabPlayer().toBeMarked()`).
 */

describe("Marked (CIN029) AAA", () => {
  it("happy: the face is the public hero-marked condition, not a type box", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], deck: 6 },
      { hero: dash, marked: true, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(marked.base.typeBox).toMatchObject({ types: [], subtypes: [] });
    expectFabPlayer(game.as(dash)).toBeMarked();
  });

  it("boundary: CIN029 cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [marked], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.play(marked)).toThrow();
    expectFabCard(Bravo, marked).toBeIn("hand");
  });

  it("timing: an opposing hit clears marked", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, marked: true, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).notToBeMarked();
  });
});
