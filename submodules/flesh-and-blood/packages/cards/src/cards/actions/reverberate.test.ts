import { reverberateBlue } from "./reverberate.ts";
import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { tomeOfFyendalYellow } from "./tome-of-fyendal.ts";
import { scaldingRainRed } from "./scalding-rain.ts";
import { reverberateRed } from "./reverberate.ts";

/**
 * Reverberate Red (ARC138) — Wizard Action.
 * "Deal 3 arcane damage to target opposing hero. If this deals damage, you may
 * banish a Wizard 'non-attack' action card from your hand with {r} cost less
 * than or equal to the damage dealt by Reverberate. If you do, you may play it
 * this turn as though it were an instant."
 *
 * Mode B (fab-rules): CR 8.5.3a/b the controller's effect damage; the banish
 * pool is restricted to Wizard non-attack actions affordable under the damage
 * ceiling; the play permission is this-turn only (CR: "as though it were an
 * instant" — no action point, expires at end of turn).
 */

describe("Reverberate (ARC138) AAA", () => {
  it("happy: deal 3, banish a Wizard action, then play it from banish as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [reverberateRed, scaldingRainRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(reverberateRed);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);

    // Accept the banish optional, pick the Wizard action, accept the play permission.
    Blaze.chooseBoolean(true);
    Blaze.chooseTargets(scaldingRainRed);
    Blaze.chooseBoolean(true);
    expect(Blaze.zone("banished")).toContain(scaldingRainRed.canonicalId);

    // Play the banished card as though it were an instant (no action point).
    Blaze.play(scaldingRainRed, { from: "banished", target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(13);
    expect(Blaze.zone("banished")).not.toContain(scaldingRainRed.canonicalId);
    expect(Blaze.zone("graveyard")).toContain(scaldingRainRed.canonicalId);
    expect(Blaze.zone("graveyard")).toContain(reverberateRed.canonicalId);
  });

  it("boundary: only Wizard 'non-attack' actions in hand are legal banish targets", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [reverberateRed, scaldingRainRed, tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(reverberateRed);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);

    Blaze.chooseBoolean(true);
    // Wizard non-attack is the legal banish; Generic is not in the set. When
    // 1.8.6c already determined the singleton Wizard, naming it is a no-op.
    Blaze.target(scaldingRainRed);
    Blaze.chooseBoolean(true);

    expect(Blaze.zone("banished")).toContain(scaldingRainRed.canonicalId);
    expect(Blaze.zone("hand")).toContain(tomeOfFyendalYellow.canonicalId);
  });

  it("timing: the play-from-banish permission expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [reverberateRed, scaldingRainRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(reverberateRed);
    game.passBoth();
    Blaze.chooseBoolean(true);
    Blaze.chooseTargets(scaldingRainRed);
    Blaze.chooseBoolean(true);
    expect(Blaze.zone("banished")).toContain(scaldingRainRed.canonicalId);

    // Do not play it; let the turn cycle.
    Blaze.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expect(() => Blaze.play(scaldingRainRed, { from: "banished", target: Dash.id })).toThrow();
  });

  it("happy: deal 1, banish a Wizard action, then play it from banish as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [reverberateBlue, scaldingRainRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(reverberateBlue);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(19);

    // Accept the banish optional, pick the Wizard action, accept the play permission.
    Blaze.chooseBoolean(true);
    Blaze.chooseTargets(scaldingRainRed);
    Blaze.chooseBoolean(true);
    expect(Blaze.zone("banished")).toContain(scaldingRainRed.canonicalId);

    // Play the banished card as though it were an instant (no action point).
    Blaze.play(scaldingRainRed, { from: "banished", target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15);
    expect(Blaze.zone("banished")).not.toContain(scaldingRainRed.canonicalId);
    expect(Blaze.zone("graveyard")).toContain(scaldingRainRed.canonicalId);
    expect(Blaze.zone("graveyard")).toContain(reverberateBlue.canonicalId);
  });
});
