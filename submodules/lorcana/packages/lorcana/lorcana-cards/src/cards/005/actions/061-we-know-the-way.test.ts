import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { weKnowTheWay } from "./061-we-know-the-way";

describe("We Know the Way", () => {
  it("shuffles the chosen discard card back and may play a revealed card with the same name for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weKnowTheWay],
      inkwell: weKnowTheWay.cost,
      discard: [simbaProtectiveCub],
      deck: [simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(weKnowTheWay, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCardDefinitionIdsInZone("play", PLAYER_ONE)).toContain(
      simbaProtectiveCub.id,
    );
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      simbaProtectiveCub.id,
    ]);
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, discard: 1, play: 1, deck: 1 });
  });

  it("regression: card stays in limbo (not discard) while the optional is pending, then finalises", () => {
    // When the optional "play for free" suspends for player input, We Know the Way must be in
    // limbo — NOT already in discard. After the decision is resolved the card finalises to discard.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weKnowTheWay],
      inkwell: weKnowTheWay.cost,
      discard: [simbaProtectiveCub],
      deck: [simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(weKnowTheWay, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    // While waiting for the optional, the card is in limbo (pending), not yet in discard
    expect(testEngine.asPlayerOne().getCardZone(weKnowTheWay)).toEqual("limbo");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, discard: 0 });

    // After declining, We Know the Way finalises to discard.
    // The revealed card (name matched) stays on deck-top — it only goes to hand when no route matches.
    expect(
      testEngine.asPlayerOne().resolveNextPending({ resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(weKnowTheWay)).toEqual("discard");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ discard: 1 });
  });

  it("regression: cycling combo — outer card goes to discard once the free play is accepted so the inner card can target it", () => {
    // Two copies: A in hand, B in discard, empty deck.
    // After A's optional is accepted and B starts resolving its own effects, A must already
    // be in discard so B's shuffle step can choose it.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weKnowTheWay],
      inkwell: weKnowTheWay.cost,
      discard: [weKnowTheWay],
      deck: [],
    });

    const discardCopyId = testEngine.asPlayerOne().getCardsInZone("discard", PLAYER_ONE)
      .cards[0]!.id;

    // Play A; shuffle B (the discard copy) into deck
    expect(
      testEngine.asPlayerOne().playCard(weKnowTheWay, {
        targets: [discardCopyId],
      }),
    ).toBeSuccessfulCommand();

    // A is in limbo while awaiting the optional decision
    expect(testEngine.getCardDefinitionIdsInZone("limbo", PLAYER_ONE)).toHaveLength(1);

    // Accept: play B for free. A's effect is now done — A should go to discard.
    // B then runs its own shuffle step and needs A as a target from discard.
    expect(
      testEngine.asPlayerOne().resolveNextPending({ resolveOptional: true }),
    ).toBeSuccessfulCommand();

    // A is in discard; B is in limbo pending its own target selection
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, discard: 1 });
    expect(testEngine.getCardDefinitionIdsInZone("limbo", PLAYER_ONE)).toHaveLength(1);
    expect(testEngine.getCardDefinitionIdsInZone("discard", PLAYER_ONE)).toContain(weKnowTheWay.id);
  });

  it("regression: puts revealed card into hand when name does not match chosen card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weKnowTheWay],
      inkwell: weKnowTheWay.cost,
      discard: [simbaProtectiveCub],
      // Top card of deck is different from chosen discard card
      deck: [weKnowTheWay],
    });

    expect(
      testEngine.asPlayerOne().playCard(weKnowTheWay, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    // Name doesn't match, so revealed card goes to hand
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, discard: 1, play: 0 });
  });
});
