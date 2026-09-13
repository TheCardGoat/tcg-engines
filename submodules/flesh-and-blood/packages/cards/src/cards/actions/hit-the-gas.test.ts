import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { hyperDriverYellow } from "./hyper-driver.ts";
import { hyperDriverBlue } from "./hyper-driver.ts";
import { nimblismBlue } from "./nimblism.ts";
import { maxxNitro } from "../heroes/maxx-nitro.ts";
import { hitTheGasBlue } from "./hit-the-gas.ts";

/**
 * Hit the Gas (SUP255) — Maxx Specialization Mechanologist Action, cost 0, 3{d}.
 *
 * Printed: Turn any number of Hyper Drivers in your banished zone face-down
 * and gain that many action points. If 3 or more cards are turned face-down
 * this way, draw a card.
 */

describe("Hit the Gas (SUP255) AAA", () => {
  it("turning 3 Hyper Drivers face-down grants 3 AP and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        hand: [hitTheGasBlue],
        banished: [
          { card: hyperDriverRed, state: { faceDown: false } },
          { card: hyperDriverYellow, state: { faceDown: false } },
          { card: hyperDriverBlue, state: { faceDown: false } },
        ],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.play(hitTheGasBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "maximum" });

    expectFabCard(Maxx, hitTheGasBlue).toBeIn("graveyard");
    expectFabPlayer(Maxx).toHaveAP(3).toHaveHandCount(1);
    expectFabCard(Maxx, hyperDriverRed).toBeFaceDown();
    expectFabCard(Maxx, hyperDriverYellow).toBeFaceDown();
    expectFabCard(Maxx, hyperDriverBlue).toBeFaceDown();
  });

  it("with no Hyper Drivers banished, grants 0 AP and does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        hand: [hitTheGasBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.play(hitTheGasBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Maxx, hitTheGasBlue).toBeIn("graveyard");
    expectFabPlayer(Maxx).toHaveAP(0).toHaveHandCount(0);
  });

  it("turning 2 Hyper Drivers grants 2 AP and does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        hand: [hitTheGasBlue],
        banished: [
          { card: hyperDriverRed, state: { faceDown: false } },
          { card: hyperDriverYellow, state: { faceDown: false } },
        ],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.play(hitTheGasBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "maximum" });

    expectFabCard(Maxx, hitTheGasBlue).toBeIn("graveyard");
    expectFabPlayer(Maxx).toHaveAP(2).toHaveHandCount(0);
    expectFabCard(Maxx, hyperDriverRed).toBeFaceDown();
    expectFabCard(Maxx, hyperDriverYellow).toBeFaceDown();
  });
});
