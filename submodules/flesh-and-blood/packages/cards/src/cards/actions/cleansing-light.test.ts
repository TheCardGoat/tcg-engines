import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { readTheRipplesRed } from "./read-the-ripples.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { cleansingLightRed } from "./cleansing-light.ts";

/**
 * Cleansing Light Red (DTD088) — Light Action.
 *
 * Printed: If a card has been put into your hero's soul this turn, you may
 * play this as though it were an instant.
 * Destroy target red aura.
 */

describe("Cleansing Light family AAA", () => {
  it("happy: destroys the seated red-friendly generic aura", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [cleansingLightRed],
        arena: [readTheRipplesRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(cleansingLightRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: readTheRipplesRed.canonicalId });

    // The printed clause targets a red aura; a red aura is seated.
    expectFabCard(Boltyn, readTheRipplesRed).toBeIn("graveyard");
    expectFabCard(Boltyn, cleansingLightRed).toBeIn("graveyard");
  });
});
