import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lexi } from "../heroes/lexi.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { tomeOfFyendalYellow } from "./tome-of-fyendal.ts";
import { flashRed } from "./flash.ts";

/**
 * Flash, Red (ELE177) — Lightning Action, cost 0, pitch 1, 2{d}.
 * Printed: 'The next action card you play this turn with cost 0 or greater
 * gets go again.\nGo again'
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.1.3a (go again refunds the action point when the card
 *     resolves), CR 5.3 (resolution ability), CR 4.4.4 ("this turn"
 *     expiry), CR 1.8.2 (layer latches onto the next qualifying play).
 *   behaviorConstraints:
 *     - a1 floats a "next action card this turn with cost ≥ 0" latch that
 *       grants go again; the grant is consumed by the first qualifying
 *     action and expires at turn end.
 *     - Flash's own printed go again refunds its action point.
 *
 * Golden idiom: ELE122-124 weave family (appliesTo.next latch) +
 * ELE085-087 bramble family (this batch).
 */

describe("Flash family AAA", () => {
  it("happy: the next action card this turn (cost 0 qualifies) gets go again — its action point is refunded", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [flashRed, tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    // Flash's own printed go again refunds its action point (CR 5.1.3a).
    Lexi.play(flashRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Lexi).toHaveAP(1);

    // Tome of Fyendal (cost 1, an action card with no go again of its own)
    // consumes the latch: its resolution refunds the spent action point.
    Lexi.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Lexi).toHaveAP(1);
    expectFabPlayer(Lexi).toHaveHandCount(2); // 2 played, 2 drawn
  });

  it("boundary: the latch serves exactly ONE action — a second action this turn keeps no refund", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [flashRed, tomeOfFyendalYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.play(flashRed);
    game.helpers.resolveUntilIdle();

    // Tome of Fyendal (cost 1 action) is the qualifying "next" — refunded.
    Lexi.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Lexi).toHaveAP(1);

    // Snatch (also a qualifying action) is SECOND: no latch remains, and
    // with no go again of its own the attack's action point stays spent.
    Lexi.attackWith(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Lexi).toHaveAP(0);
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: the latch expires — next turn's qualifying action keeps no refund", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [flashRed, nimblismBlue, tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    // Flash resolves but no action follows this turn.
    Lexi.play(flashRed);
    game.helpers.resolveUntilIdle();
    Lexi.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // "This turn" rolled over (CR 4.4.4). Floating resources reset at the
    // rollover, so the Tome's {r} is paid by pitching Nimblism — cost 1
    // would qualify if the latch survived, but no refund arrives.
    Lexi.must.pitch(nimblismBlue).play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Lexi).toHaveAP(0);
    expectFabPlayer(Lexi).toHaveHandCount(4); // upkept − pitch − play + 2 drawn
  });
});
