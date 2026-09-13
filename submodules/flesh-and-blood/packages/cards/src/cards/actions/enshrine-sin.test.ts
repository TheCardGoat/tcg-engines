import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { nimblismBlue } from "./nimblism.ts";
import { enshrineSinRed, enshrineSinYellow } from "./enshrine-sin.ts";

/**
 * Enshrine Sin, Red — Shadow Runeblade Action, cost 0, 2{d}.
 *
 * Printed: "You may play this from your banished zone. If you do, it costs an
 * additional {r} to play. Opt 1, then create a Runechant token. Go again.
 * Blood Debt"
 */

describe("Enshrine Sin AAA", () => {
  it("happy: from hand it opts, creates a Runechant, and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [enshrineSinRed],
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(enshrineSinRed);
    game.untilIdle({ optBottom: 0 });

    expectFabPlayer(Chane).toHaveTokenCount("runechant", 1).toHaveAP(1);
    expectFabCard(Chane, enshrineSinRed).toBeIn("graveyard");
  });

  it("happy: from banished it costs an extra {r} and still creates a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [enshrineSinRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(enshrineSinRed, { from: "banished" });
    game.untilIdle({ optBottom: 0 });

    expectFabPlayer(Chane).toHaveTokenCount("runechant", 1).toHaveResourceCount(0).toHaveAP(1);
    expectFabCard(Chane, enshrineSinRed).toBeIn("graveyard");
  });

  it("boundary: from banished with no {r} it cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [enshrineSinRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    expectFabUnplayable(() => Chane.play(enshrineSinRed, { from: "banished" }));
    expectFabCard(Chane, enshrineSinRed).toBeBanished();
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 0);
  });

  it("happy: yellow from banished costs the printed extra {r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [enshrineSinYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(enshrineSinYellow, { from: "banished" });
    game.untilIdle({ optBottom: 0 });

    expectFabPlayer(Chane).toHaveTokenCount("runechant", 1).toHaveResourceCount(0).toHaveAP(1);
    expectFabCard(Chane, enshrineSinYellow).toBeIn("graveyard");
  });

  it("boundary: yellow from banished with only 1{r} cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [enshrineSinYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    expectFabUnplayable(() => Chane.play(enshrineSinYellow, { from: "banished" }));
    expectFabCard(Chane, enshrineSinYellow).toBeBanished();
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 0);
  });
});
