/**
 * CR 8.5.19 Search failure rules:
 *  a) may fail if only PRIVATE cards match the filter
 *  b) cannot fail if a PUBLIC card matches the filter
 *  c) cannot fail if no filter is specified and the zone is non-empty
 *  d) empty zone → the search effect fails
 *
 * Visibility classification (CR 3.0.4a) is in rules/public-zone.ts. The search
 * proposal's found.length===0 branch applies the a/b/c/d legality.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, heartOfFyendal, nimblismBlue } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

const searchDeck = (filter: Record<string, unknown>, zones: readonly string[] = ["deck"]) => ({
  type: "search" as const,
  zones: zones as never,
  filter: filter as never,
  to: { zone: "hand" as const },
  count: 1,
});

describe("effect: search — CR 8.5.19c/d", () => {
  it("8.5.19d: an empty zone makes the search resolve empty (effect fails)", () => {
    const attack = hitTrainer({
      slug: "fx-search-empty-zone",
      power: 4,
      effect: searchDeck({ name: "Does Not Exist" }, ["graveyard"]),
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 4 },
      // dash graveyard is empty by default → searched zone is empty.
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // 8.5.19d: empty searched zone → the search fails, moving no card.
    const movedToHand = game
      .committedEvents()
      .some((e) => e.name === "move-zone" && e.data.reason === "search");
    expect(movedToHand).toBe(false);
  });

  it("8.5.19c: no filter + non-empty zone → search always finds (cannot fail)", () => {
    const attack = hitTrainer({
      slug: "fx-search-no-filter",
      power: 4,
      effect: searchDeck({}),
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 8, resourcePoints: 0 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // No filter + non-empty deck → the search must find a card (cannot fail):
    // a card is moved to hand via the search.
    const movedToHand = game
      .committedEvents()
      .some((e) => e.name === "move-zone" && e.data.reason === "search");
    expect(movedToHand).toBe(true);
  });

  it("8.5.19a: filter with no PUBLIC match → search may fail (resolves empty)", () => {
    // A filter that matches nothing, over a PRIVATE zone (deck) that is
    // non-empty: no public card matches → the player may fail (resolve empty).
    const attack = hitTrainer({
      slug: "fx-search-private-nomatch",
      power: 4,
      effect: searchDeck({ name: "Does Not Exist" }, ["deck"]),
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 8, resourcePoints: 0 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // No public match → the search resolves empty (may fail): no card moved.
    const movedToHand = game
      .committedEvents()
      .some((e) => e.name === "move-zone" && e.data.reason === "search");
    expect(movedToHand).toBe(false);
  });

  it("8.5.19b: a PUBLIC match → the search finds (cannot fail)", () => {
    // A public zone (graveyard) with a card matching the filter → the search
    // must find it (cannot fail). Seed Nimblism in the opponent's graveyard.
    const attack = hitTrainer({
      slug: "fx-search-public-match",
      power: 4,
      effect: {
        type: "search",
        zones: ["graveyard"],
        filter: { name: "Nimblism" } as never,
        to: { zone: "hand" },
        count: 1,
        player: "opponent",
      },
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 4, resourcePoints: 0 },
      { hero: dash, graveyard: [nimblismBlue], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Public match → the search finds and moves the card (cannot fail).
    const movedToHand = game
      .committedEvents()
      .some((e) => e.name === "move-zone" && e.data.reason === "search");
    expect(movedToHand).toBe(true);
  });
});
