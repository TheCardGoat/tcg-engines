import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar, brutalAssaultBlue } from "../shared/test-recipients.ts";
import { starworldWarningYellow } from "./starworld-warning.ts";

/**
 * Starworld Warning (OMN188) — Lightning Instant, cost 1.
 * Printed: "Create 2 Lightning Flow tokens."
 */

describe("Starworld Warning (Yellow) (OMN188) AAA", () => {
  it("happy: paying 1 creates 2 Lightning Flow tokens and spends no action point", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [starworldWarningYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(starworldWarningYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("lightning-flow", 2);
    expectFabPlayer(Briar).toHaveAP(1);
    expectFabCard(Briar, starworldWarningYellow).toBeIn("graveyard");
  });

  it("boundary: with unpayable resources the cast is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [starworldWarningYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expect(() => Briar.play(starworldWarningYellow)).toThrow();
    expectFabPlayer(Briar).toHaveTokenCount("lightning-flow", 0);
  });

  it("timing: may be cast in the reaction window", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: briar,
        hand: [starworldWarningYellow],
        resourcePoints: 1,
        deck: 6,
      },
    );
    game.as(dash).playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    game.as(briar).play(starworldWarningYellow);

    expectFabPlayer(game.as(briar)).toHaveTokenCount("lightning-flow", 2);
  });
});
