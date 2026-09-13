import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  expectFabUnplayable,
  fabToken,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { snatchRed } from "../actions/snatch.ts";
import { oscilioForkedContinuum } from "./oscilio-forked-continuum.ts";

/**
 * Oscilio, Forked Continuum (OMN094) — Lightning Wizard Hero — 38hp.
 *
 * Printed: "Instant - {r}, {t}, destroy a Lightning Flow you control:
 * Discard a card and create a Ponder token. If an instant is discarded this
 * way, you may play it this turn."
 *
 * Pattern mirrors oscilio-scion-of-the-third-age.test.ts (young OMN095).
 */

const opponentHero = dash;

describe("oscilio-forked-continuum (OMN094) AAA", () => {
  it("happy: destroys Lightning Flow, discards an instant, creates Ponder, and grants play permission", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilioForkedContinuum,
        arena: [fabToken("lightning-flow")],
        hand: [sigilOfSolaceRed],
        resourcePoints: 1,
        life: 38,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Oscilio = game.as(oscilioForkedContinuum);

    Oscilio.activate(oscilioForkedContinuum);
    // Singleton Lightning Flow cost and singleton hand discard are determined
    // (CR 1.8.6c). Do not `.target()` them.
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabToken(game, "lightning-flow").toHaveCount(0);
    expectFabToken(game, "ponder").toHaveCount(1).toBeIn("arena");
    expectFabPlayer(Oscilio).toHaveResourceCount(0);

    // The discarded instant may be played this turn — Sigil of Solace gains
    // 3 life when played, proving the play resolved from the graveyard.
    game.helpers.passPriorityTo(Oscilio);
    Oscilio.play(sigilOfSolaceRed, { from: "graveyard" });
    game.passBoth();
    expectFabPlayer(Oscilio).toHaveLife(41);
  });

  it("boundary: the discard puts a non-instant in the graveyard without play permission", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilioForkedContinuum,
        arena: [fabToken("lightning-flow")],
        hand: [snatchRed],
        resourcePoints: 1,
        life: 38,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Oscilio = game.as(oscilioForkedContinuum);

    Oscilio.activate(oscilioForkedContinuum);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Oscilio, snatchRed).toBeIn("graveyard");
    expectFabToken(game, "ponder").toHaveCount(1);
  });

  it("boundary: without a Lightning Flow to destroy the activation is illegal", () => {
    const game = FabTestEngine.start(
      { hero: oscilioForkedContinuum, resourcePoints: 1, deck: 6 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Oscilio = game.as(oscilioForkedContinuum);

    expectFabUnplayable(
      () => Oscilio.activate(oscilioForkedContinuum),
      /destroy cost is unavailable/i,
    );
  });
});
