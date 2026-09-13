import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { weaveLightningRed } from "./weave-lightning.ts";
import { blossomingSpellbladeRed } from "./blossoming-spellblade.ts";

/**
 * Blossoming Spellblade (ELE064) — Elemental Runeblade Action - Attack, cost 2, 6{p}.
 *
 * Printed: Earth and Lightning Fusion. Fused: granted damage rider + when you
 * attack with this, if fused, deal 1 arcane to target hero.
 */

describe("Blossoming Spellblade (ELE064) AAA", () => {
  it("happy: fused on-attack deals 1 arcane then 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [blossomingSpellbladeRed, weaveEarthRed, weaveLightningRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(blossomingSpellbladeRed, {
      fuse: true,
      fuseCards: [weaveEarthRed, weaveLightningRed],
      stopAt: "on-attack",
    });
    Briar.target(Dash);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: unfused deals only printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [blossomingSpellbladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(blossomingSpellbladeRed);
    game.closeCombat({ ordering: "listed" });

    expectCombat(game).toBeClosed();
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("timing: fused arcane resolves before combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [blossomingSpellbladeRed, weaveEarthRed, weaveLightningRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(blossomingSpellbladeRed, {
      fuse: true,
      fuseCards: [weaveEarthRed, weaveLightningRed],
      stopAt: "on-attack",
    });
    Briar.target(Dash);
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(19);
    expectCombat(game).toBeOpen();
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(13);
  });
});
