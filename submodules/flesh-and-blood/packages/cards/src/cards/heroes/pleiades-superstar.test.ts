import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { tensionInTheAirRed } from "../instants/tension-in-the-air.ts";
import { superstarBlue } from "../instants/superstar.ts";
import { pleiadesSuperstar } from "./pleiades-superstar.ts";

/**
 * Pleiades, Superstar (APS001) — Revered Guardian Hero — 40hp.
 *
 * Printed: "Instant — {t}, remove a suspense counter from an aura you control:
 * You may put a suspense counter on an aura of suspense you control.
 * Whenever the crowd cheers you, create a Confidence token."
 */

describe("Pleiades, Superstar (APS001) AAA", () => {
  it("happy: the Instant moves a suspense counter between auras you control", () => {
    const game = FabTestEngine.start(
      { hero: pleiadesSuperstar, arena: [tensionInTheAirRed, tensionInTheAirRed], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);
    const [source, destination] = Pleiades.cardsIn("arena", tensionInTheAirRed);

    Pleiades.activate(pleiadesSuperstar);
    game.advanceToDecision(Pleiades, "entity-target");
    Pleiades.target(source!);
    if (game.pendingDecision()?.kind === "boolean") {
      Pleiades.chooseBoolean(true);
    }
    game.advanceToDecision(Pleiades, "entity-target");
    Pleiades.target(destination!);
    game.passBoth();

    expectFabCard(Pleiades, source!).toHaveCounters(1, "suspense");
    expectFabCard(Pleiades, destination!).toHaveCounters(3, "suspense");
    expectFabCard(Pleiades, pleiadesSuperstar).toBeTapped();
  });

  it("boundary: cannot activate when no aura has a suspense counter", () => {
    const game = FabTestEngine.start(
      { hero: pleiadesSuperstar, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.expectActivationRejected(pleiadesSuperstar);
  });

  it("timing: a crowd cheer creates a Confidence token (Superstar entry cheer)", () => {
    // Superstar: "When this enters or leaves the arena, the crowd cheers you."
    // Each cheer creates a Confidence token on Pleiades, Superstar.
    const game = FabTestEngine.start(
      { hero: pleiadesSuperstar, hand: [superstarBlue], resourcePoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.play(superstarBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Pleiades, superstarBlue).toBeIn("arena");
    expectFabToken(game, "confidence").toHaveCount(1).toBeIn("arena");
  });
});
