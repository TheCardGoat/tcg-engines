import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { ritesOfLightningRed } from "./rites-of-lightning.ts";

/**
 * Rites of Lightning (ELE070) — Elemental Runeblade Attack, cost 1, 4{p}.
 *
 * Printed: Lightning Fusion. When you attack with this, if it was fused,
 * deal 1 arcane to target hero. If you have dealt arcane this turn, this
 * gains go again.
 */

describe("Rites of Lightning (ELE070) AAA", () => {
  it("happy: fused Lightning deals 1 arcane on attack", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ritesOfLightningRed, lightningPressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(ritesOfLightningRed, {
      fuse: true,
      fuseCards: [lightningPressRed],
      stopAt: "on-attack",
    });
    Briar.target(Dash);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: without fusion it is a 4-power attack and deals no extra arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ritesOfLightningRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(ritesOfLightningRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: fused on-attack arcane resolves before combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ritesOfLightningRed, lightningPressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(ritesOfLightningRed, {
      fuse: true,
      fuseCards: [lightningPressRed],
      stopAt: "on-attack",
    });
    Briar.target(Dash);
    game.advanceUntil({ stopAt: "defend" });
    expectFabPlayer(Dash).toHaveLife(19);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(15);
  });
});
