import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { cartilageCrushYellow } from "../actions/cartilage-crush.ts";
import { upOnAPedestalBlue } from "./up-on-a-pedestal.ts";

/**
 * Up on a Pedestal (APS028) — Revered Guardian Instant Aura (Suspense).
 *
 * Printed: When this enters or leaves the arena, you may put a Revered or
 * Guardian attack action card from your graveyard on top of your deck.
 */

describe("Up on a Pedestal (APS028) AAA", () => {
  it("happy: entering the arena puts a Guardian attack from graveyard on top of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [upOnAPedestalBlue],
        graveyard: [cartilageCrushYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(upOnAPedestalBlue);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: cartilageCrushYellow.canonicalId,
      ordering: "listed",
    });

    expectFabCard(Bravo, upOnAPedestalBlue).toBeIn("arena");
    expect(Bravo.zone("deck").at(-1)).toBe(cartilageCrushYellow.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(cartilageCrushYellow.canonicalId);
  });

  it("boundary: declining the optional leaves the Guardian attack in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [upOnAPedestalBlue],
        graveyard: [cartilageCrushYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(upOnAPedestalBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabCard(Bravo, upOnAPedestalBlue).toBeIn("arena");
    expectFabCard(Bravo, cartilageCrushYellow).toBeIn("graveyard");
  });

  it("timing: a Generic attack action in the graveyard is not a legal choice", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [upOnAPedestalBlue],
        graveyard: [snatchRed],
        deck: [
          cartilageCrushYellow,
          cartilageCrushYellow,
          cartilageCrushYellow,
          cartilageCrushYellow,
          cartilageCrushYellow,
          cartilageCrushYellow,
        ],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(upOnAPedestalBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Bravo, upOnAPedestalBlue).toBeIn("arena");
    expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
    expect(Bravo.zone("deck").at(-1)).not.toBe(snatchRed.canonicalId);
  });
});
