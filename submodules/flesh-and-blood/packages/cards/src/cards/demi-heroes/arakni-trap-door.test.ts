import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { hunterSKlaive } from "../weapons/hunter-s-klaive.ts";
import { snatchRed } from "../actions/snatch.ts";
import { arakniTrapDoor } from "./arakni-trap-door.ts";

/**
 * Arakni, Trap-Door (HNT008) — Chaos Assassin Demi-Hero (Agent).
 *
 * Printed:
 *   When you become this, you may search your deck for a card, banish it
 *   face-down, then shuffle. If it's a trap, you may play it until the start
 *   of your next turn.
 *   At the beginning of your end phase, return to the brood.
 *
 * The become trigger is reached through Arakni, Marionette's end-phase
 * Agents-of-Chaos transform. The "If it's a trap" play-permission leg is
 * reached with a non-trap search only: banishing a trap would resolve the
 * unmigrated play-card leaf (gap effect/play-card-unmigrated).
 */

describe("Arakni, Trap-Door (HNT008) AAA", () => {
  it("happy: becoming this searches the deck and banishes the chosen card face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [hunterSKlaive],
        inventory: [arakniTrapDoor],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    // Mark the defending hero — Marionette's end-phase transform then fires.
    Arakni.activate(hunterSKlaive);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Arakni.endTurn();

    // The selected Agent's become trigger offers its search optional.
    game.helpers.resolveUntilIdle({
      optionals: "accept",
      entityTargetCanonicalId: snatchRed.canonicalId,
      ordering: "listed",
    });

    expectFabCard(Arakni, snatchRed).toBeBanished().toBeFaceDown();
  });

  it("boundary: declining the search optional banishes nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [hunterSKlaive],
        inventory: [arakniTrapDoor],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(hunterSKlaive);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Arakni.endTurn();

    game.helpers.resolveUntilIdle({ optionals: "decline", ordering: "listed" });

    // Nothing was banished: the chosen card is still in the deck.
    expect(Arakni.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Arakni.zone("banished")).not.toContain(snatchRed.canonicalId);
  });
});
