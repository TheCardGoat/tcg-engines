import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { songOfSweetNectarBlue } from "./song-of-sweet-nectar.ts";

/**
 * Song of Sweet Nectar Blue (TCC065) — Bard Action Song.
 *
 * Printed: Each other hero gains 1{h}.
 */

describe("Song of Sweet Nectar (TCC065) AAA", () => {
  it("happy: each OTHER hero gains 1{h} — the controller does not", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [songOfSweetNectarBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);
    const kanoBase = Kano.life();

    Kano.play(songOfSweetNectarBlue);
    game.helpers.resolveUntilIdle();

    // 1v1: "each other hero" is the single opponent.
    expectFabPlayer(Dash).toHaveLife(21); // 20 + 1
    expect(Kano.life()).toBe(kanoBase); // controller excluded
    expectFabCard(Kano, songOfSweetNectarBlue).toBeIn("graveyard");
  });
});
