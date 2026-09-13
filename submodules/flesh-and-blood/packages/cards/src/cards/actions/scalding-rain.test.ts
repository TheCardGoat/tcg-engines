import { scaldingRainBlue } from "./scalding-rain.ts";
import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { scaldingRainRed } from "./scalding-rain.ts";

/**
 * Scalding Rain Red (ARC141) — "Deal 4 arcane damage to target hero."
 *
 * Mode B (fab-rules): CR 8.5.3b arcane damage is dealt by an effect (not an
 * attack); CR 8.5.3f Arcane Barrier prevention is arcane-specific; printed
 * "target hero" is any seated hero (self included) — unlike the opposing-only
 * pings in this set.
 */

describe("Scalding Rain (ARC141) AAA", () => {
  it("happy: deals 4 arcane damage to the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [scaldingRainRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(scaldingRainRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, scaldingRainRed).toBeIn("graveyard");
    // Effect damage: no combat chain opens (CR 8.5.3b).
    expect(game.combat()).toBeNull();
  });

  it("boundary: Arcane Barrier 1 prevents 1 of the 4 arcane damage", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [scaldingRainRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, resourcePoints: 1, head: [nullruneHood], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(scaldingRainRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("timing: printed 'target hero' is any hero — the caster may self-target", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        life: 20,
        hand: [scaldingRainRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(scaldingRainRed, { target: Blaze.id });
    game.passBoth();

    expectFabPlayer(Blaze).toHaveLife(16);
    expectFabCard(Blaze, scaldingRainRed).toBeIn("graveyard");
  });

  it("happy: deals 2 arcane damage to the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [scaldingRainBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(scaldingRainBlue, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Blaze, scaldingRainBlue).toBeIn("graveyard");
    // Effect damage: no combat chain opens (CR 8.5.3b).
    expect(game.combat()).toBeNull();
  });
});
