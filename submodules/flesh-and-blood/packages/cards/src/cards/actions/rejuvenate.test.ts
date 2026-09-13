import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { inspireLightningRed } from "./inspire-lightning.ts";
import { rejuvenateBlue, rejuvenateRed, rejuvenateYellow } from "./rejuvenate.ts";

/**
 * Rejuvenate Red (ELE106) — Elemental Action.
 *
 * Printed: Gain 3{h}
 * If you've fused this turn, you may play Rejuvenate as though it were an
 * instant.
 */

describe("Rejuvenate family AAA", () => {
  it("happy: playing it gains 3{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [rejuvenateRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(rejuvenateRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveLife(23); // 20 + 3
    expectFabCard(Briar, rejuvenateRed).toBeIn("graveyard");
  });

  it("family: yellow gains 2{h} and blue gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [rejuvenateYellow, rejuvenateBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(rejuvenateYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveLife(22);

    Briar.play(rejuvenateBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveLife(23);
  });

  it("boundary: without fusing this turn it cannot be played after the action point is spent", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [inspireLightningRed, rejuvenateRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(inspireLightningRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveAP(0);

    expectFabUnplayable(
      () => Briar.must.playInstant(rejuvenateRed),
      /action-point cost cannot be paid/i,
    );
    expectFabCard(Briar, rejuvenateRed).toBeIn("hand");
  });

  it("timing: after fusing this turn it plays from arsenal as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [inspireLightningRed, lightningPressRed],
        arsenal: [rejuvenateRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(inspireLightningRed, {
      fuse: true,
      fuseCards: [lightningPressRed],
      target: Dash.id,
    });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveAP(0);

    Briar.must.playFromArsenal(rejuvenateRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveLife(23);
    expectFabPlayer(Briar).toHaveAP(0);
    expectFabCard(Briar, rejuvenateRed).toBeIn("graveyard");
  });
});
