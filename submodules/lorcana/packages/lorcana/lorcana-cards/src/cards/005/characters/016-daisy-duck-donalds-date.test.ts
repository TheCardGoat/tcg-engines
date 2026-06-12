import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { daisyDuckDonaldsDate } from "./016-daisy-duck-donalds-date";
import { donaldDuckBuccaneer } from "../../004";
import { donaldDuckCoinCollector } from "../../008";
import { donaldDuckBoisterousFowl } from "../../001";

const topCharacter = createMockCharacter({
  id: "daisy-duck-donalds-date-top-character",
  name: "Top Character",
  cost: 2,
});

const bottomAction = createMockAction({
  id: "daisy-duck-donalds-date-bottom-action",
  name: "Bottom Action",
  cost: 1,
  text: "A test action.",
});

const topAction = createMockAction({
  id: "daisy-duck-donalds-date-top-action",
  name: "Top Action",
  cost: 1,
  text: "Another test action.",
});

describe("Daisy Duck - Donald's Date", () => {
  it("lets the opponent put a revealed character card into their hand when Daisy quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [daisyDuckDonaldsDate],
        deck: [donaldDuckBuccaneer, donaldDuckCoinCollector, donaldDuckBoisterousFowl],
      },
      {
        deck: [topCharacter],
      },
    );

    // Single mandatory opponent-chooser trigger auto-accepts from bag
    expect(testEngine.asPlayerOne().quest(daisyDuckDonaldsDate)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        destinations: [{ zone: "hand", cards: [topCharacter] }],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(topCharacter)).toBe("hand");

    // UX rule-bend: scry-revealed cards stay visible to all players until a full
    // turn cycle passes, so both players can track what was revealed. When the
    // opponent puts the character card into their hand, it remains revealed.
    const reveals = testEngine.getAuthoritativeState().ctx.zones.reveals.active;
    const characterInstanceId = testEngine.findCardInstanceId(topCharacter, "hand", PLAYER_TWO);
    expect(reveals.some((r) => r.cardIDs.includes(characterInstanceId))).toBe(true);
  });

  it("puts a revealed non-character card on the bottom of the opponent's deck when Daisy quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [daisyDuckDonaldsDate],
        deck: [donaldDuckBuccaneer, donaldDuckCoinCollector, donaldDuckBoisterousFowl],
      },
      {
        deck: [topAction, bottomAction],
      },
    );

    // Single mandatory opponent-chooser trigger auto-accepts from bag
    expect(testEngine.asPlayerOne().quest(daisyDuckDonaldsDate)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(
      testEngine.asPlayerTwo().resolveNextPending({ destinations: [] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(topAction)).toBe("deck");
    expect(testEngine.asPlayerTwo().getCardZone(bottomAction)).toBe("deck");
    // bottomAction was on top (last in array), revealed and moved to deck-bottom (index 0)
    // topAction was at bottom (first in array), now at top
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_TWO).slice(0, 2)).toEqual([
      bottomAction.id,
      topAction.id,
    ]);

    // UX rule-bend: even when a non-character card is bottomed, it remains
    // revealed to all players. This lets both players track what was seen
    // during the scry, reducing hidden-information tracking burden.
    const reveals = testEngine.getAuthoritativeState().ctx.zones.reveals.active;
    const actionInstanceId = testEngine.findCardInstanceId(bottomAction, "deck", PLAYER_TWO);
    expect(reveals.some((r) => r.cardIDs.includes(actionInstanceId))).toBe(true);
  });

  it("reveals the scried card to Daisy's controller (P1) while the opponent resolves BIG PRIZE", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [daisyDuckDonaldsDate],
        deck: [donaldDuckBuccaneer, donaldDuckCoinCollector, donaldDuckBoisterousFowl],
      },
      {
        deck: [topCharacter],
      },
    );

    // P1 quests with Daisy — BIG PRIZE suspends awaiting P2's scry decision
    expect(testEngine.asPlayerOne().quest(daisyDuckDonaldsDate)).toBeSuccessfulCommand();

    // While the scry is pending, the top card of P2's deck must be visible to P1
    // (Daisy's controller) because the card text says "each opponent reveals the top card".
    const topCardInstanceId = testEngine.findCardInstanceId(topCharacter, "deck", PLAYER_TWO);
    const reveals = testEngine.getAuthoritativeState().ctx.zones.reveals.active;
    const revealForCard = reveals.find((r) => r.cardIDs.includes(topCardInstanceId));
    expect(revealForCard).toBeDefined();
    // The reveal must be visible to PLAYER_ONE (the controller), not only PLAYER_TWO (the chooser)
    expect(
      revealForCard!.visibleTo === "all" ||
        (revealForCard!.visibleTo as string[]).includes(PLAYER_ONE),
    ).toBe(true);
  });

  it("prompts the opponent (not the controller) when Daisy's owner is the other player", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [topAction, topCharacter],
      },
      {
        play: [daisyDuckDonaldsDate],
        deck: [donaldDuckCoinCollector, donaldDuckBuccaneer],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // Single mandatory opponent-chooser trigger auto-accepts from bag
    expect(testEngine.asPlayerTwo().quest(daisyDuckDonaldsDate)).toBeSuccessfulCommand();

    // The pending effect should be assigned to Player One (the opponent), not Player Two
    const pending = testEngine.getAuthoritativeState().G.pendingEffects ?? [];
    expect(pending.length).toBe(1);
    expect(pending[0]!.chooserId).toBe(PLAYER_ONE);
    expect(pending[0]!.kind).toBe("scry-selection");

    // Player One resolves: put the revealed character into their hand
    const topCardP1 = testEngine.findCardInstanceId(topCharacter, "deck", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [{ zone: "hand", cards: [topCardP1] }],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(topCharacter)).toBe("hand");

    // Player Two's deck should be completely untouched by the scry
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_TWO)).toContain(
      donaldDuckCoinCollector.id,
    );
  });
});
