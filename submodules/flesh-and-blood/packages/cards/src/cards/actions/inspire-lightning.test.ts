import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { inspireLightningRed } from "./inspire-lightning.ts";

/**
 * Inspire Lightning (ELE088) — Elemental Runeblade Action, Lightning Fusion.
 * Fused: deal 3 arcane. Unfused: no damage.
 */

describe("Inspire Lightning family AAA", () => {
  it("happy: fused with Lightning pitch deals 3 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [inspireLightningRed, lightningPressRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(inspireLightningRed, {
      fuse: true,
      fuseCards: [lightningPressRed],
      target: Dash.id,
    });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Briar, lightningPressRed).toBeIn("hand");
    expectFabCard(Briar, inspireLightningRed).toBeIn("graveyard");
  });

  it("boundary: unfused deals no damage", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [inspireLightningRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(inspireLightningRed);
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Briar, inspireLightningRed).toBeIn("graveyard");
  });

  it("timing: after resolution the card is in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [inspireLightningRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(inspireLightningRed);
    game.passBoth();

    expectFabCard(Briar, inspireLightningRed).toBeIn("graveyard");
  });
});
