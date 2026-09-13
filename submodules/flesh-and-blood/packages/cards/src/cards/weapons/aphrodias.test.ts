import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { aphrodias } from "./aphrodias.ts";

describe("Aphrodias (AZS002) AAA", () => {
  it("boundary: without a holo-counter aura this turn the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [aphrodias],
        hand: [],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(aphrodias);
    expectFabCard(Bravo, aphrodias).toBeIn("weapon1");
  });

  it("happy: seating keeps the Orb in weapon1", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon1: [aphrodias], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabCard(game.as(bravo), aphrodias).toBeIn("weapon1");
  });
});
