import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { scaldingRainRed } from "./scalding-rain.ts";
import { scaldingRainBlue } from "./scalding-rain.ts";
import { aetherFlareRed } from "./aether-flare.ts";

/**
 * Aether Flare Red (ARC132) — Wizard Action.
 * "Deal 3 arcane damage to target opposing hero. The next card you play this
 * turn with an effect that deals arcane damage, instead deals that much arcane
 * damage plus X, where X is the damage dealt by Aether Flare."
 *
 * Mode B (fab-rules): CR 8.5.3b arcane damage is effect damage; the boost is a
 * replacement scoped to the NEXT arcane-damage card played THIS turn (CR Ch.6
 * layer-continuous "next card" precedent, e.g. Tempest Aurora).
 */

describe("Aether Flare (ARC132) AAA", () => {
  it("happy: the next arcane card this turn deals 4 plus the 3 dealt by Aether Flare", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherFlareRed, scaldingRainRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(aetherFlareRed);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);

    // Replacement: Scalding Rain's 4 arcane becomes 4 + 3.
    Blaze.play(scaldingRainRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(10);
    expectFabCard(Blaze, aetherFlareRed).toBeIn("graveyard");
  });

  it("boundary: only the NEXT arcane card is boosted — a later one is not", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherFlareRed, scaldingRainRed, scaldingRainBlue],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(aetherFlareRed);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);

    // First arcane card consumes the "next" slot: 4 + 3.
    Blaze.play(scaldingRainRed, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(10);

    // Second arcane card this turn is unboosted: plain 2.
    Blaze.play(scaldingRainBlue, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(8);
  });

  it("timing: the boost expires at the end of the turn Aether Flare resolved", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherFlareRed, scaldingRainRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(aetherFlareRed);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);

    Blaze.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    // New turn: the this-turn window has closed, so Scalding Rain is unboosted.
    Blaze.play(scaldingRainRed, { target: Dash.id, pitch: [nimblismBlue] });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(13);
  });
});
