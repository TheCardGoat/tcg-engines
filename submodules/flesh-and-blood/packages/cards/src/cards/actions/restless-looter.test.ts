import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { restlessLooterRed } from "./restless-looter.ts";

describe("Restless Looter (IAR) AAA", () => {
  it("happy: its Instant activation taps, discards, and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessLooterRed],
        hand: [nimblismBlue],
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(restlessLooterRed);
    game.untilIdle();

    expectFabCard(Malice, restlessLooterRed).toBeTapped();
    expectFabCard(Malice, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Malice, snatchRed).toBeIn("hand");
  });

  it("boundary: a tapped Looter cannot activate again", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessLooterRed],
        hand: [nimblismBlue],
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(restlessLooterRed);
    game.untilIdle();
    Malice.expectActivationRejected(restlessLooterRed);

    expectFabPlayer(Malice).toHaveHandCount(1);
  });

  it("boundary: with an empty hand the activation taps Looter but does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessLooterRed],
        hand: [],
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(restlessLooterRed);
    game.untilIdle();

    expectFabCard(Malice, restlessLooterRed).toBeTapped();
    expectFabPlayer(Malice).toHaveHandCount(0);
  });
});
