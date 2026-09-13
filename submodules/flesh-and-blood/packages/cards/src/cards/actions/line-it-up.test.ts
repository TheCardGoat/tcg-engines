import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { lineItUpYellow } from "./line-it-up.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";

/**
 * Line It Up (AAZ024) — Ranger Action (yellow).
 *
 * Printed:
 *   Your next arrow attack this turn gets +3{p}.
 *   You may turn a face-down arrow in your arsenal face-up. If you do, put an
 *   aim counter on it.
 *   Go again
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution abilities), CR 6.2 (layer-continuous
 *     effects — "your next arrow attack this turn" is a this-turn modifier
 *     bound to the next Arrow attack), CR 8.2 (Arrow subtype: only playable
 *     from arsenal while controlling a Bow), CR 8.3 (go again grants +1 AP
 *     when the layer resolves).
 *   behaviorConstraints:
 *     - The +3{p} applies only to the controller's next ARROW attack this
 *       turn; a non-arrow attack does not receive it.
 *     - The arsenal clause is optional: declining it leaves the arrow
 *       face-down with no aim counter; accepting turns one face-down arrow
 *       face-up and adds exactly one aim counter to it.
 *     - Go again refunds the action point spent to play Line It Up.
 *   testImplications:
 *     - Assert the aimed arrow's attack power (base 4 + 3 = 7), the aim
 *       counter + face-up state, the non-arrow contrast (base 4), and the
 *       declined-optional contrast (still face-down, zero aim counters).
 */

describe("Line It Up (AAZ024) AAA", () => {
  it("happy: the next arrow attack gets +3{p} and the aimed arrow gains an aim counter", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [lineItUpYellow],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(lineItUpYellow);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: searingShotRed.canonicalId,
    });

    // Optional clause executed: face-up arrow in arsenal with one aim counter.
    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
    expectFabCard(Azalea, searingShotRed).toBeFaceUp();
    expectFabCard(Azalea, searingShotRed).toHaveCounters(1, "aim");
    // Go again refunded the action point spent to play Line It Up.
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    // Searing Shot base 4 + 3 from Line It Up = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a non-arrow attack played after Line It Up does not get the +3", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [lineItUpYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(lineItUpYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Azalea.attackWith(snatchRed);
    // Snatch is not an Arrow, so it stays at its printed 4{p}.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: declining the optional leaves the arsenal arrow face-down with no aim counter", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [lineItUpYellow],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(lineItUpYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
    expectFabCard(Azalea, searingShotRed).toBeFaceDown();
    expectFabCard(Azalea, searingShotRed).toHaveCounters(0, "aim");
  });
});
