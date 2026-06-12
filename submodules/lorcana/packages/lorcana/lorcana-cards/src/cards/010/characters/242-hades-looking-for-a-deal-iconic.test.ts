import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { robinHoodTimelyContestant } from "../../005";
import { donaldDuckGhostHunter, mickeyMouseDetective } from "../../010";
import { hadesLookingForADealIconic } from "./242-hades-looking-for-a-deal-iconic";

describe("Hades - Looking for a Deal (Iconic)", () => {
  it("lets the opposing player put the chosen character on the bottom of their deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADealIconic],
        inkwell: hadesLookingForADealIconic.cost,
        deck: 10,
      },
      {
        play: [donaldDuckGhostHunter, mickeyMouseDetective],
        deck: 5,
      },
    );
    const chosenId = testEngine.findCardInstanceId(donaldDuckGhostHunter, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(hadesLookingForADealIconic)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hadesLookingForADealIconic, {
        resolveOptional: true,
        targets: [chosenId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();

    expect(testEngine.getAuthoritativeState().ctx.zones.private.cardIndex[chosenId]?.zoneKey).toBe(
      "deck:player_two",
    );
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });

  it("lets the opposing player refuse and makes Hades's controller draw 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADealIconic],
        inkwell: hadesLookingForADealIconic.cost,
        deck: 10,
      },
      {
        play: [donaldDuckGhostHunter, mickeyMouseDetective],
        deck: 5,
      },
    );
    const chosenId = testEngine.findCardInstanceId(mickeyMouseDetective, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(hadesLookingForADealIconic)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hadesLookingForADealIconic, {
        resolveOptional: true,
        targets: [chosenId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();

    expect(testEngine.getAuthoritativeState().ctx.zones.private.cardIndex[chosenId]?.zoneKey).toBe(
      "play:player_two",
    );
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("cannot choose an opposing character with Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADealIconic],
        inkwell: hadesLookingForADealIconic.cost,
        deck: 10,
      },
      {
        play: [donaldDuckGhostHunter, robinHoodTimelyContestant],
        deck: 5,
      },
    );
    const wardedId = testEngine.findCardInstanceId(robinHoodTimelyContestant, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(hadesLookingForADealIconic)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hadesLookingForADealIconic, {
        resolveOptional: true,
        targets: [wardedId],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(hadesLookingForADealIconic)).toBe("play");
  });
});
