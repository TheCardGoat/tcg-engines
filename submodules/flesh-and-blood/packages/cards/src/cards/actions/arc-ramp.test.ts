import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { lightningFlow } from "../tokens/lightning-flow.ts";
import { arcRampRed } from "./arc-ramp.ts";

/**
 * Arc Ramp, Red (OMN100) — Lightning Wizard Action, cost 0. Amp 3.
 * Printed: "Amp 3. You may destroy a Lightning Flow you control. If you
 * do, this gets go again."
 * The printed-leak double-encoding of go again was closed 2026-08-26 —
 * refund requires a real destroy, proven on the accept path (the amp
 * reveal cascade just needs an explicit boolean answer).
 */

describe("Arc Ramp, Red (OMN100) AAA", () => {
  it("boundary: declining leaves the Lightning Flow alive and spends the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [lightningFlow],
        hand: [arcRampRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(arcRampRed, { modeIds: ["decline"] });
    game.passBoth();

    expectFabCard(Blaze, lightningFlow).toBeIn("arena");
    expectFabPlayer(Blaze).toHaveAP(0);
  });

  it("happy: destroying the Lightning Flow refunds the action point (go again)", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [lightningFlow],
        hand: [arcRampRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(arcRampRed, { modeIds: ["accept"] });
    game.helpers.resolveUntilIdle({
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: true,
    });

    // The destroyed Lightning Flow token has left the arena entirely.
    expectFabPlayer(Blaze).toHaveTokenCount("lightning-flow", 0);
    expectFabPlayer(Blaze).toHaveAP(1);
  });

  it("boundary: with no Lightning Flow in play there is nothing to destroy and no go again refund", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [arcRampRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(arcRampRed);
    game.passBoth();

    // Printed: go again only when a Lightning Flow was destroyed. Playing
    // the cost-0 action without one spends the AP and refunds nothing.
    expectFabPlayer(Blaze).toHaveAP(0);
  });

  it("happy: accepting the destroy consumes the flow and refunds go again", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [lightningFlow],
        hand: [arcRampRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(arcRampRed);
    // The optional destroy pendings after the play drains; accepting it is
    // what fires the "If you do" grant.
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // A destroyed token leaves the object record entirely.
    const flowsLeft = Blaze.cardsIn("arena", {
      canonicalId: lightningFlow.canonicalId,
    }).length;
    expect(flowsLeft).toBe(0);
    // Play spent the action point; the printed go again refunded it.
    expectFabPlayer(Blaze).toHaveAP(1);
  });
});
