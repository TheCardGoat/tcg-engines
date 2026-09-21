import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { songOfYesteryearsBlue } from "./song-of-yesteryears.ts";

/**
 * Song of Yesteryears Blue (TCC069) — Bard Action Song.
 *
 * Printed: Each other hero puts an attack action card from their graveyard
 * on the bottom of their deck.
 */

describe("Song of Yesteryears (TCC069) AAA", () => {
  it("happy: the opponent bottoms an attack action from their graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [songOfYesteryearsBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], graveyard: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(songOfYesteryearsBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: brutalAssaultBlue.canonicalId,
    });

    expect(Dash.zone("deck")[0]).toBe(brutalAssaultBlue.canonicalId); // bottomed
    expectFabCard(Kano, songOfYesteryearsBlue).toBeIn("graveyard");
  });

  it("boundary: a non-attack action in the opponent's graveyard is not moved", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [songOfYesteryearsBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], graveyard: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(songOfYesteryearsBlue);
    game.untilIdle();

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Kano, songOfYesteryearsBlue).toBeIn("graveyard");
  });

  it("seat: the opponent is asked to bottom their own attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [songOfYesteryearsBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], graveyard: [snatchRed, brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(songOfYesteryearsBlue);
    // CR 1.8.6: "each other hero" is the instructed seat for its own zone —
    // Dash picks which of his own graveyard attack actions to bottom.
    game.advanceToDecision(Dash, "entity-target");
    Dash.target(brutalAssaultBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(Dash.zone("deck")[0]).toBe(brutalAssaultBlue.canonicalId); // bottomed
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    expectFabCard(Kano, songOfYesteryearsBlue).toBeIn("graveyard");
  });
});
