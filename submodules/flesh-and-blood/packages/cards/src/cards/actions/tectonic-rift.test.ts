import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { tectonicRiftBlue } from "./tectonic-rift.ts";

/**
 * Tectonic Rift (Blue) (EVO238) — Guardian Action.
 *
 * Printed: "Create X Seismic Surge tokens.\nGo again"
 *
 * Mode B (fab-rules): CR 5.1.3a (the variable cost X is declared when playing
 * the card and card-text references to X read that declared value; the catalog
 * cost is X-only), CR 1.12.2 (declaration process), CR 8.6.2 (Seismic Surge
 * token — a token aura with a destroy-ability), CR 7.6.2/go again glossary
 * (the action point is refunded when the card-layer resolves). Behavior
 * constraints: exactly X Seismic Surge tokens are created under the player's
 * control when the action resolves; X is bound per play (each declaration is
 * independent); the declared X must be payable.
 */

describe("Tectonic Rift (Blue) (EVO238) AAA", () => {
  it("happy: declared X=2 pays 2 resources and creates exactly 2 Seismic Surge tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tectonicRiftBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(tectonicRiftBlue, { xValue: 2 });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 2);
    // The declared X is paid in full at play time.
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    // Go again refunds the spent action point when the card-layer resolves.
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, tectonicRiftBlue).toBeIn("graveyard");
  });

  it("boundary: the X declaration is bounded by payable resources and X=0 creates nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tectonicRiftBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    // CR 5.1.3a: X is declared when the card is played. With only 2 resources
    // in the pool the declaration decision offers exactly 0..2 — a higher X
    // is never a legal declaration.
    Bravo.exec({
      move: "begin-play",
      payload: { instanceId: Bravo.findCardInZone("hand", tectonicRiftBlue) },
    });
    expectWait(game).toHaveNumericRange(0, 2);

    // Declaring X=0 pays nothing, creates nothing, and the action still
    // resolves (with its go again refund).
    game.answerDecision(Bravo.id, { kind: "numeric", value: 0 });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 0);
    expectFabPlayer(Bravo).toHaveResourceCount(2);
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, tectonicRiftBlue).toBeIn("graveyard");
  });

  it("timing: two Rifts in one turn each bind their own X and stack tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tectonicRiftBlue, tectonicRiftBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(tectonicRiftBlue, { xValue: 1 });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 1);

    // The second play declares an independent X=2.
    Bravo.play(tectonicRiftBlue, { xValue: 2 });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 3);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    // Both plays spent and refunded one action point each.
    expectFabPlayer(Bravo).toHaveAP(2);
  });
});
