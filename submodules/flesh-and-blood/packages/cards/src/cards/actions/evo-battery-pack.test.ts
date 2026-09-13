import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { cerebellumProcessorBlue } from "./cerebellum-processor.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseChest } from "../equipment/teklo-base-chest.ts";
import { evoBatteryPackYellow } from "./evo-battery-pack.ts";

/**
 * Evo Battery Pack (EVO047) — Mechanologist Action Evo Chest d2.
 * Instant destroy-under-this pays by destroying a hosted sub-card (CR 3.0.14).
 */

describe("Evo Battery Pack (EVO047) AAA", () => {
  it("happy: destroy the hosted base chest to put a steam counter on a cranked item", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        hand: [evoBatteryPackYellow],
        arena: [cerebellumProcessorBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoBatteryPackYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabCard(Teklo, evoBatteryPackYellow).toBeIn("chest");
    // CR 3.0.14: the transform seated the base chest under the evo.
    expectFabCard(Teklo, tekloBaseChest).toBeUnder(evoBatteryPackYellow);

    Teklo.activate(evoBatteryPackYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    // The destroy really happened: the hosted base chest reached the graveyard.
    expectFabCard(Teklo, tekloBaseChest).toBeIn("graveyard");
    // The printed effect resolved: the item's enter counter (1) plus the
    // granted counter (2 total) — a reversal leaves it at 1.
    expectFabCard(Teklo, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Teklo, cerebellumProcessorBlue).toHaveCounters(2, "steam");
  });

  it("boundary: Instant destroy-under-this is unpayable with no card under this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [evoBatteryPackYellow],
        arena: [cerebellumProcessorBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(teklovossen).expectActivationRejected(evoBatteryPackYellow);
  });

  it("timing: without paying destroy-under-this the crank item keeps its printed steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [evoBatteryPackYellow],
        arena: [cerebellumProcessorBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.expectActivationRejected(evoBatteryPackYellow);
    expectFabCard(Teklo, cerebellumProcessorBlue).toBeIn("arena");
  });
});
