import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { cleansingLightRed } from "./cleansing-light.ts";
import { hauntingSpecterRed } from "./haunting-specter.ts";

/**
 * Haunting Specter Red (MST140) — Illusionist Action Aura. Ward 4.
 *
 * Printed: When this leaves the arena, create a Spectral Shield token,
 * then if you control no other Illusionist auras, put a +1{p} counter on
 * it.
 */

describe("Haunting Specter (MST140) AAA", () => {
  it("happy: destroyed alone, the leave trigger seats a Shield with +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [hauntingSpecterRed],
        hand: [cleansingLightRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(cleansingLightRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: hauntingSpecterRed.canonicalId });

    expectFabCard(Prism, hauntingSpecterRed).toBeIn("graveyard");
    // Leaves-arena trigger: a fresh Spectral Shield with a +1{p} counter
    // (no other Illusionist auras were seated).
    expectFabToken(game, "spectral-shield").toHaveCount(1);
  });
});
