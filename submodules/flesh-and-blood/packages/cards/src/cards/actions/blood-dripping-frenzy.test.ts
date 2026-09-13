import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { unhallowedRitesRed } from "./unhallowed-rites.ts";
import { bloodDrippingFrenzyBlue } from "./blood-dripping-frenzy.ts";

/**
 * Blood-Dripping Frenzy, Blue (DTD111) — Shadow/Brute Action. Go again.
 * Printed: "As an additional cost to play this, banish your hand. Draw a card
 * for each card with blood debt banished this way. Your Brute and Shadow
 * attacks get +X{p} this turn, where X is the number of cards with 6 or more
 * {p} banished this way."
 * The all-count hand-banish additional cost binds the whole hand (minus the
 * card on the stack) with no selection decision; empty hand is vacuously
 * payable (engine/unmigrated-banish-hand-all-cost).
 */

describe("Blood-Dripping Frenzy, Blue (DTD111) AAA", () => {
  it("happy: the whole hand is banished as the cost and one blood-debt card draws one", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bloodDrippingFrenzyBlue, unhallowedRitesRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 3,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(bloodDrippingFrenzyBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    // The cost banished both remaining hand cards; the frenzy resolved to the
    // graveyard; the single blood-debt card drew exactly one card back.
    expect(Rhinar.zone("banished")).toHaveLength(2);
    expect(Rhinar.zone("banished")).toContain(unhallowedRitesRed.canonicalId);
    expect(Rhinar.zone("banished")).toContain(nimblismBlue.canonicalId);
    expectFabCard(Rhinar, bloodDrippingFrenzyBlue).toBeIn("graveyard");
    expect(Rhinar.zone("hand")).toHaveLength(1);
    expectFabPlayer(Rhinar).toHaveAP(1); // printed go again
  });

  it("boundary: an otherwise empty hand is a vacuous cost — playable with no draws", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bloodDrippingFrenzyBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 3,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(bloodDrippingFrenzyBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(Rhinar.zone("banished")).toHaveLength(0);
    expect(Rhinar.zone("hand")).toHaveLength(0); // zero blood-debt cards, zero draws
    expectFabPlayer(Rhinar).toHaveAP(1);
  });
});
