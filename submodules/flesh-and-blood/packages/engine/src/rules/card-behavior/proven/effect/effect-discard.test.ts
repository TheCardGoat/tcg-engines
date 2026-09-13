/**
 * AAA test for effect: discard.
 * Representative card: Madcap Muscle Red (DYN019) — Brute Action Attack, cost 3.
 * Play effect: "As an additional cost to play Madcap Muscle, discard a random card."
 * Resolution: "If the discarded card has 6 or more {p}, Madcap Muscle has +3{p}."
 *
 * The discard is a random additional-cost; the engine handles it automatically.
 * We verify by checking committed events for a "discard" event.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer, expectFabUnplayable } from "../../../../testing/index.ts";
import { bravo, dash, madcapMuscleRed, nimblismBlue, nimbleStrikeRed } from "../../../fixtures.ts";

describe("effect: discard", () => {
  it("AAA: Madcap Muscle's random discard cost moves a hand card to graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [madcapMuscleRed, nimblismBlue, nimblismBlue],
        deck: 4,
        resourcePoints: 3,
        intellect: 0,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(madcapMuscleRed, { target: game.as(dash).id });

    // Playing Madcap Muscle removes it from hand (→ combat chain).
    // The random discard cost removes one more card from hand → graveyard.
    expectFabPlayer(Bravo).toHaveHandCount(1);

    // Verify a discard event was committed.
    const discardEvents = game
      .committedEvents()
      .filter((event) => event.name === "discard" && event.data.playerId === Bravo.id);
    expect(discardEvents).toHaveLength(1);
  });

  it("AAA boundary: a normal action card does not produce a discard event", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed, nimblismBlue, nimblismBlue],
        deck: 4,
        resourcePoints: 1,
        intellect: 0,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimbleStrikeRed, { target: game.as(dash).id });

    // Only the played card leaves hand; no random discard.
    expectFabPlayer(Bravo).toHaveHandCount(2);

    const discardEvents = game
      .committedEvents()
      .filter((event) => event.name === "discard" && event.data.playerId === Bravo.id);
    expect(discardEvents).toHaveLength(0);
  });

  it("AAA edge: Madcap Muscle cannot be played without a card to discard", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [madcapMuscleRed], deck: 4, resourcePoints: 3, intellect: 0 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Hand only contains Madcap Muscle itself, so its required random-discard
    // cost is unpayable. CR 5.1.8a / 1.10.3 reverse the announce.
    expectFabUnplayable(() => Bravo.play(madcapMuscleRed, { target: game.as(dash).id }));
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });
});
