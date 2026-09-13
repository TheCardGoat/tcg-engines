import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { thirdEyeOfTheSphinx } from "./third-eye-of-the-sphinx.ts";
import { sigilOfForethoughtBlue } from "../instants/sigil-of-forethought.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { exposedBlue } from "../attack-reactions/exposed.ts";

/**
 * Third Eye of the Sphinx (OMN140) — Illusionist / Wizard Equipment - Head.
 *
 * Printed: "Instant - {r}, {t}, destroy a Ponder token you control: Draw a
 * card. Spellvoid 1 / Blade Break"
 */
describe("Third Eye of the Sphinx (OMN140) AAA", () => {
  it("happy: tapping the head and destroying a Ponder token draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        head: [thirdEyeOfTheSphinx],
        hand: [sigilOfForethoughtBlue, nimblismBlue, exposedBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    // Seat a Ponder: the sigil self-destructs at Kano's next action phase.
    Kano.play(sigilOfForethoughtBlue);
    game.helpers.resolveUntilIdle();
    Kano.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Kano).toHaveTokenCount("ponder", 1);

    // Floating RP reset at Kano's last end phase, so the {r} is pitched.
    const handBefore = Kano.handCount();
    const deckBefore = Kano.zone("deck").length;
    Kano.activate(thirdEyeOfTheSphinx);
    game.helpers.resolveUntilIdle({ paymentCanonicalId: nimblismBlue.canonicalId });

    // The Ponder token was destroyed as cost and the head is tapped.
    expectFabPlayer(Kano).toHaveTokenCount("ponder", 0);
    expectFabCard(Kano, thirdEyeOfTheSphinx).toBeTapped();
    // One card left the hand as pitch and the draw replaced it.
    expectFabPlayer(Kano).toHaveHandCount(handBefore);
    // The drawn card came from the deck.
    expect(Kano.zone("deck")).toHaveLength(deckBefore - 1);
  });

  it("boundary: with no Ponder token in play the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        head: [thirdEyeOfTheSphinx],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.expectActivationRejected(thirdEyeOfTheSphinx);
    expectFabCard(Kano, thirdEyeOfTheSphinx).toBeIn("head");
  });
});
