import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { scaldingRainRed } from "./scalding-rain.ts";
import { blazingAetherRed } from "./blazing-aether.ts";

/**
 * Blazing Aether Red (ARC118) — Kano Specialization.
 * "Deal X arcane damage to target hero, where X is the amount of arcane damage
 * you have dealt to that hero this turn."
 *
 * Mode B (fab-rules): CR 8.5.3a the controller of the damage source is
 * considered to have dealt the damage; CR 8.5.3b arcane damage is effect
 * damage; X counts only prior arcane damage dealt TO the chosen hero THIS turn.
 *
 * NOTE: the "to that hero" target-scoping boundary (arcane damage dealt to a
 * different hero must not count toward X) is BLOCKED on a card-definition gap —
 * see card-implementation-plan.md §5 (ARC118 row). The module's damage-dealt
 * count is not target-scoped, so that boundary is not yet assertable green.
 */

describe("Blazing Aether (ARC118) AAA", () => {
  it("happy: X equals the arcane damage already dealt to that hero this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        life: 20,
        hand: [scaldingRainRed, blazingAetherRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    // 4 arcane to Dash first (CR 8.5.3a: Kano dealt it).
    Kano.play(scaldingRainRed, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(16);

    Kano.play(blazingAetherRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(12);
    expectFabCard(Kano, blazingAetherRed).toBeIn("graveyard");
  });

  it("boundary: no prior arcane damage this turn means X is 0", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        life: 20,
        hand: [blazingAetherRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(blazingAetherRed, { target: Dash.id });
    game.passBoth();

    // X = 0: no life is lost.
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Kano, blazingAetherRed).toBeIn("graveyard");
  });

  it("timing: arcane damage dealt on an earlier turn does not count toward X", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        life: 20,
        hand: [scaldingRainRed, blazingAetherRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    // Turn 1: 4 arcane to Dash, but do NOT play Blazing Aether yet.
    Kano.play(scaldingRainRed, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(16);

    Kano.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    // Turn 3 (Kano's next turn): the turn ledger has reset, so X = 0.
    Kano.play(blazingAetherRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(16);
  });
});
