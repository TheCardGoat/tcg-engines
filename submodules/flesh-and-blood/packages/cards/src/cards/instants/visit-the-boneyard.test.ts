import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { battlefrontBastionYellow } from "../actions/battlefront-bastion.ts";
import { visitTheBoneyardBlue } from "./visit-the-boneyard.ts";

/**
 * Visit the Boneyard Blue (SUP139) — Brute Instant.
 *
 * Printed: Put a card with 6 or more {p} from your graveyard on top of
 * your deck.
 * Create a Vigor token.
 */

describe("Visit the Boneyard (SUP139) AAA", () => {
  it("happy: the 6{p} graveyard card is put on top of the deck; the Vigor is created", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [visitTheBoneyardBlue],
        graveyard: [battlefrontBastionYellow],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(visitTheBoneyardBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: battlefrontBastionYellow.canonicalId,
    });

    // Printed "put ... on top of your deck": the 6{p} pick leaves the
    // graveyard for the deck and the Vigor creation resolves. (The deck is
    // outside the default card-ref scope, so count it by zone.)
    expect(Kano.cardsIn("deck", battlefrontBastionYellow)).toHaveLength(1);
    expect(Kano.cardsIn("graveyard", battlefrontBastionYellow)).toHaveLength(0);
    expectFabToken(game, "vigor").toHaveCount(1);
  });

  it("boundary: with no 6{p} card the Vigor is still created", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [visitTheBoneyardBlue],
        graveyard: [],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(visitTheBoneyardBlue);
    game.helpers.resolveUntilIdle();

    expectFabToken(game, "vigor").toHaveCount(1);
    expectFabCard(Kano, visitTheBoneyardBlue).toBeIn("graveyard");
  });
});
