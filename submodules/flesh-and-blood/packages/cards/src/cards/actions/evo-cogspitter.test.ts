import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { cerebellumProcessorBlue } from "./cerebellum-processor.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseArms } from "../equipment/teklo-base-arms.ts";
import { evoCogspitterYellow } from "./evo-cogspitter.ts";

/**
 * Evo Cogspitter (EVO048) — Mechanologist Action Evo Arms d2.
 * Instant destroy-under-this pays by destroying a hosted sub-card (CR 3.0.14).
 */

describe("Evo Cogspitter (EVO048) AAA", () => {
  it("happy: destroy the hosted base arms to put a cheap item into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        hand: [evoCogspitterYellow, cerebellumProcessorBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoCogspitterYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabCard(Teklo, evoCogspitterYellow).toBeIn("arms");
    // CR 3.0.14: the transform seated the base arms under the evo.
    expectFabCard(Teklo, tekloBaseArms).toBeUnder(evoCogspitterYellow);

    Teklo.activate(evoCogspitterYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    // The destroy really happened: the hosted base arms reached the graveyard.
    expectFabCard(Teklo, tekloBaseArms).toBeIn("graveyard");
    // The printed effect resolved: the hand item entered the arena (a
    // reversal leaves it in hand).
    expectFabCard(Teklo, cerebellumProcessorBlue).toBeIn("arena");
  });

  it("boundary: Instant destroy-under-this is unpayable with no card under this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [evoCogspitterYellow],
        hand: [cerebellumProcessorBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(teklovossen).expectActivationRejected(evoCogspitterYellow);
  });

  it("timing: without paying destroy-under-this the hand item stays in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [evoCogspitterYellow],
        hand: [cerebellumProcessorBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.expectActivationRejected(evoCogspitterYellow);
    expectFabCard(Teklo, cerebellumProcessorBlue).toBeIn("hand");
  });
});
