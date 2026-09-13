import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { finalActRed } from "./final-act.ts";
import { encoreYellow } from "./encore.ts";

/**
 * Encore Yellow (TCC061) — Bard Action. Go again.
 *
 * Printed: Return a Bard attack action card from your graveyard to your
 * hand.
 */

describe("Encore (TCC061) AAA", () => {
  it("happy: returns a Bard attack action card from the graveyard and refunds go again", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [encoreYellow],
        graveyard: [finalActRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(encoreYellow);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: finalActRed.canonicalId,
    });

    expectFabCard(Kano, finalActRed).toBeIn("hand");
    expectFabPlayer(Kano).toHaveAP(1);
    expectFabCard(Kano, encoreYellow).toBeIn("graveyard");
  });

  it("boundary: with no Bard attack in the graveyard it still resolves with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [encoreYellow],
        graveyard: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(encoreYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kano).toHaveHandCount(0);
    expectFabPlayer(Kano).toHaveAP(1);
    expectFabCard(Kano, encoreYellow).toBeIn("graveyard");
  });
});
