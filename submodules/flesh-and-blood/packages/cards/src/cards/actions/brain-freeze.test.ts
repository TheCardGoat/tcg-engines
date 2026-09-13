import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { cranialCrushBlue } from "./cranial-crush.ts";
import { brainFreezeRed } from "./brain-freeze.ts";

/**
 * Brain Freeze (Red) (UPR116) — Elemental Wizard Action, cost 0.
 * Printed: Ice Fusion. Target opponent reveals their hand. If Brain Freeze
 * was fused, put an action card with cost 2 or less from their hand on top
 * of their deck.
 *
 * The reveal step has no outputBinding; the fused put-on-top is a separate
 * at-resolution hand pick (not `them`/`it`).
 */

describe("Brain Freeze (UPR116) AAA", () => {
  it("happy: fused, a cost-2 action is put on top of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [brainFreezeRed, weaveIceRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, cranialCrushBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(brainFreezeRed, { fuse: true, fuseCards: [weaveIceRed] });
    game.passBoth();
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: brutalAssaultBlue.canonicalId });

    expect(Dash.cardsIn("deck", brutalAssaultBlue)).toHaveLength(1);
    expect(Dash.zone("deck").at(-1)).toBe(brutalAssaultBlue.canonicalId);
    expectFabCard(Dash, cranialCrushBlue).toBeIn("hand");
    expectFabCard(Iyslander, weaveIceRed).toBeIn("hand");
    expectFabCard(Iyslander, brainFreezeRed).toBeIn("graveyard");
  });

  it("boundary: unfused, the opponent reveals but nothing is put on top", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [brainFreezeRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, cranialCrushBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(brainFreezeRed);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, brutalAssaultBlue).toBeIn("hand");
    expectFabCard(Dash, cranialCrushBlue).toBeIn("hand");
    expect(Dash.cardsIn("deck", brutalAssaultBlue)).toHaveLength(0);
    expectFabPlayer(Dash).toHaveHandCount(2);
    expectFabCard(Iyslander, brainFreezeRed).toBeIn("graveyard");
  });

  it("timing: fused, a cost-6 action is not put on top of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [brainFreezeRed, weaveIceRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [cranialCrushBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(brainFreezeRed, { fuse: true, fuseCards: [weaveIceRed] });
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, cranialCrushBlue).toBeIn("hand");
    expect(Dash.cardsIn("deck", cranialCrushBlue)).toHaveLength(0);
    expectFabCard(Iyslander, brainFreezeRed).toBeIn("graveyard");
  });
});
