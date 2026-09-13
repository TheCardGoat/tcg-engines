import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kayo } from "../heroes/kayo.ts";
import { bravo } from "../heroes/bravo.ts";
import { toughness } from "../tokens/toughness.ts";
import { ripUpTheirVirtuesBlue } from "./rip-up-their-virtues.ts";

/**
 * Rip Up Their Virtues (SUP088) — Reviled Instant.
 *
 * Printed: Destroy up to 3 Toughness tokens. Create a Might token for each
 *          token destroyed this way.
 */

describe("Rip Up Their Virtues (SUP088) AAA", () => {
  it("happy: destroying 3 Toughness tokens creates 3 Might", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [ripUpTheirVirtuesBlue],
        arena: [toughness, toughness, toughness],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.play(ripUpTheirVirtuesBlue);
    game.untilIdle({ entityTargets: "maximum", optionals: "decline", ordering: "listed" });

    expectFabPlayer(Kayo).toHaveTokenCount("toughness", 0).toHaveTokenCount("might", 3);
  });

  it("boundary: with no Toughness tokens, no Might is created", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [ripUpTheirVirtuesBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.play(ripUpTheirVirtuesBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Kayo).toHaveTokenCount("toughness", 0).toHaveTokenCount("might", 0);
  });
});
