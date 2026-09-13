import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { pyroglyphicProtectionRed } from "./pyroglyphic-protection.ts";

/**
 * Pyroglyphic Protection (EVR131) — Wizard Action Aura, cost 2, {d} 2.
 *
 * Printed: If your hero would be dealt arcane damage, prevent 3 arcane damage
 * that source would deal. At the beginning of your action phase, destroy this.
 */

describe("Pyroglyphic Protection (EVR131) AAA", () => {
  it("happy: prevent 3 of Voltic Bolt's 5 arcane while the aura is in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [pyroglyphicProtectionRed],
        life: 20,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [volticBoltRed, crackedBaubleYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(pyroglyphicProtectionRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Kano, pyroglyphicProtectionRed).toBeIn("arena");

    Kano.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Dash.must.pitch(crackedBaubleYellow).play(volticBoltRed, { target: Kano.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kano).toHaveLife(18);
    expectFabCard(Kano, pyroglyphicProtectionRed).toBeIn("arena");
  });

  it("boundary: after the aura is destroyed, a later bolt deals the full 5", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [pyroglyphicProtectionRed],
        life: 20,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [volticBoltRed, crackedBaubleYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(pyroglyphicProtectionRed);
    game.helpers.resolveUntilIdle();
    Kano.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Kano, pyroglyphicProtectionRed).toBeIn("graveyard");

    Kano.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.must.pitch(crackedBaubleYellow).play(volticBoltRed, { target: Kano.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kano).toHaveLife(15);
  });

  it("timing: beginning of your next action phase destroys the aura", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [pyroglyphicProtectionRed],
        life: 20,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(pyroglyphicProtectionRed);
    game.helpers.resolveUntilIdle();
    Kano.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Kano, pyroglyphicProtectionRed).toBeIn("arena");

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Kano, pyroglyphicProtectionRed).toBeIn("graveyard");
  });
});
