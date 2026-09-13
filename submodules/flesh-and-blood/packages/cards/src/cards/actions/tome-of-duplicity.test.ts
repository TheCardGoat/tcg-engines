import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { tomeOfDuplicityBlue } from "./tome-of-duplicity.ts";

/**
 * Tome of Duplicity Blue (UPR168) — look at the top 2 cards of your deck,
 * then banish one. If it's a non-attack action card, you may play it this
 * turn as though it were an instant.
 */

describe("Tome of Duplicity (UPR168) AAA", () => {
  it("happy: banishes one of the looked-at cards", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [tomeOfDuplicityBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [snatchRed, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(tomeOfDuplicityBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: nimblismBlue.canonicalId,
      optionalBoolean: false,
    });

    expectFabCard(Blaze, nimblismBlue).toBeBanished();
    expect(Blaze.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabCard(Blaze, tomeOfDuplicityBlue).toBeIn("graveyard");
  });

  it("boundary: banishing an attack does not offer the play-this-turn optional", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [tomeOfDuplicityBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [snatchRed, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(tomeOfDuplicityBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: snatchRed.canonicalId,
      optionalBoolean: false,
    });

    expectFabCard(Blaze, snatchRed).toBeBanished();
    expect(Blaze.zone("deck")).toContain(nimblismBlue.canonicalId);
    expectFabCard(Blaze, tomeOfDuplicityBlue).toBeIn("graveyard");
  });
});
