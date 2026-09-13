import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { aetherSpindleRed } from "./aether-spindle.ts";

/**
 * Aether Spindle Red (ARC126) — deal 4 arcane, then Opt X where X is damage dealt.
 */

describe("Aether Spindle (ARC126) AAA", () => {
  it("happy: deals 4 arcane then Opt X (X = damage dealt) looks at 4 cards", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherSpindleRed],
        resourcePoints: 2,
        actionPoints: 1,
        // Distinct tops so Opt has four entries (deck is bottom-first; last is top).
        deck: 8,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(aetherSpindleRed, { target: Dash.id });
    // Play auto-answers the Opt partition (keep all on top).
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, aetherSpindleRed).toBeIn("graveyard");
    expectFabPlayer(Blaze).toHaveAP(0);
    expect(Blaze.resourcePoints()).toBe(0);
  });

  it("boundary: without Aether Spindle the opposing hero stays at printed life", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: resolution finishes Opt X with no stuck decision", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherSpindleRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 8,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(aetherSpindleRed, { target: game.as(dash).id });
    game.helpers.resolveUntilIdle();

    expectWait(game).notToHaveDecision();
    expectFabCard(Blaze, aetherSpindleRed).toBeIn("graveyard");
  });
});
