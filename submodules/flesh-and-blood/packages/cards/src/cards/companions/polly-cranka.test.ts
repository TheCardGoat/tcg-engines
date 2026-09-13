import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { pollyCranka } from "./polly-cranka.ts";

/**
 * Polly Cranka (SEA003) — Puffin Companion - Off-Hand Ally, Crank, Perched.
 *
 * Printed: "Action - {t}, banish this: Return this to the arena under its
 * owner's control, unequipped, tapped, and with a steam counter."
 */

describe("Polly Cranka (SEA003) AAA", () => {
  it("happy: cranking Polly returns her tapped with a steam counter", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        arena: [pollyCranka],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activate(pollyCranka);
    game.helpers.resolveUntilIdle();

    expectFabCard(Kassai, pollyCranka).toBeIn("arena").toBeTapped();
    expectFabCard(Kassai, pollyCranka).toHaveCounters(1, "steam");
  });

  it("boundary: a tapped Polly cannot crank again", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        arena: [pollyCranka],
        hand: [],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activate(pollyCranka);
    game.helpers.resolveUntilIdle();
    Kassai.expectActivationRejected(pollyCranka);

    expectFabCard(Kassai, pollyCranka).toHaveCounters(1, "steam");
  });
});
