import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { arcanicShockwaveRed } from "./arcanic-shockwave.ts";

describe("Arcanic Shockwave (ELE073) AAA", () => {
  it("happy: fused Lightning deals 1 arcane on attack", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [arcanicShockwaveRed, lightningPressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(arcanicShockwaveRed, {
      fuse: true,
      fuseCards: [lightningPressRed],
      stopAt: "on-attack",
    });
    // Fused on-attack arcane ("deal 1 arcane to target hero") is left pending by
    // the explicit drive; the test names the target instead of auto-self-hitting.
    Briar.target(Dash);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: without fusion it is a 4-power attack and deals no extra arcane", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [arcanicShockwaveRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(arcanicShockwaveRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: fused on-attack arcane resolves before combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [arcanicShockwaveRed, lightningPressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(arcanicShockwaveRed, {
      fuse: true,
      fuseCards: [lightningPressRed],
      stopAt: "on-attack",
    });
    Briar.target(Dash);
    // Resolve the on-attack arcane layer to the Defend step (arcane before damage).
    game.advanceUntil({ stopAt: "defend" });
    expectFabPlayer(Dash).toHaveLife(19);
    expect(game.combat()?.open).toBe(true);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(15);
  });
});
