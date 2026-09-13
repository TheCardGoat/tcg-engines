import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { lexi } from "./lexi.ts";
import { shiver } from "../weapons/shiver.ts";
import { electrifyRed as electrify } from "../actions/electrify.ts";
import { blizzardBlue } from "../instants/blizzard.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Lexi (ELE032).
 *
 * Printed: "Once per Turn Action - Turn a face-down card in your arsenal
 * face-up: If it's a Lightning card, your next attack this turn gets go
 * again. If it's an Ice card, create a Frostbite token under target hero's
 * control. Go again"
 *
 * Proves:
 * - Flip is the printed cost (face-down → face-up) and go again refunds the AP
 * - Lightning flip: the next attack gains go again on the chain link
 * - Ice flip: a Frostbite token is created under the opponent's control
 * - Boundaries: once per turn, no face-down arsenal card
 * - Signature weapon: Shiver (ELE033)
 *
 * Pattern mirrors lexi-livewire.test.ts (adult Lexi, 40hp) with young stats.
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

describe("lexi (ELE032) AAA", () => {
  it("core mechanic: flips the face-down arsenal card face-up and go again refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        arsenal: [{ card: snatchRed, state: { faceDown: true } }],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Lexi = game.as(lexi);

    expectFabCard(Lexi, snatchRed).toBeIn("arsenal").toBeFaceDown();
    expectFabPlayer(Lexi).toHaveAP(1);

    Lexi.activate(lexi);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Lexi, snatchRed).toBeIn("arsenal").toBeFaceUp();
    // −1 AP for the activation, +1 from the ability's go again.
    expectFabPlayer(Lexi).toHaveAP(1);
  });

  it("core mechanic: flipping a Lightning card grants go again to the next attack", () => {
    // electrify is a Lightning action card — the Lightning rider applies.
    const game = FabTestEngine.start(
      {
        hero: lexi,
        arsenal: [{ card: electrify, state: { faceDown: true } }],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Lexi = game.as(lexi);

    Lexi.activate(lexi);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Attack with snatch — the granted go again must show on the chain link.
    if (!Lexi.hasPriority()) {
      game.as(opponentHero).pass();
    }
    Lexi.attackWith(snatchRed);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveKeyword("go-again");
  });

  it("core mechanic: flipping an Ice card creates a Frostbite token under the opponent", () => {
    // blizzard is a real Ice card — the Ice rider applies.
    const game = FabTestEngine.start(
      {
        hero: lexi,
        arsenal: [{ card: blizzardBlue, state: { faceDown: true } }],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Lexi = game.as(lexi);
    const Opponent = game.as(opponentHero);

    Lexi.activate(lexi);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Opponent).toHaveTokenCount("frostbite", 1);
    expectFabPlayer(Lexi).toHaveTokenCount("frostbite", 0);
  });

  it("boundaries: once per turn — second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        arsenal: [
          { card: electrify, state: { faceDown: true } },
          { card: blizzardBlue, state: { faceDown: true } },
        ],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Lexi = game.as(lexi);

    Lexi.activate(lexi);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    Lexi.expectActivationRejected(lexi);
  });

  it("boundaries: no face-down arsenal card → activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        arsenal: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Lexi = game.as(lexi);

    Lexi.expectActivationRejected(lexi);
  });

  it("signature weapon: Shiver (ELE033) activated as an Instant for 1{r} is not an attack", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [shiver],
        resourcePoints: 1,
        actionPoints: 0,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Lexi = game.as(lexi);

    Lexi.activate(shiver);
    game.passBoth();

    // Shiver's activation is an instant ability, not an attack.
    expectCombat(game).toBeClosed();
    expectFabPlayer(Lexi).toHaveResourceCount(0);
  });
});
