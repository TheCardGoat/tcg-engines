import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli } from "../../001";
import { megaraSecretKeeper } from "../characters/086-megara-secret-keeper";
import { blessedBagpipes } from "./101-blessed-bagpipes";

const opponentAttacker = createMockCharacter({
  id: "bagpipes-opponent-attacker",
  name: "Opponent Attacker",
  cost: 5,
  strength: 5,
  willpower: 5,
});

describe("Blessed Bagpipes", () => {
  it("may put the top card of your deck under a chosen character with Boost when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [aladdinPrinceAli],
      hand: [blessedBagpipes],
      inkwell: blessedBagpipes.cost,
      play: [megaraSecretKeeper],
    });
    const storedCardId = testEngine.findCardInstanceId(aladdinPrinceAli, "deck", "p1");

    expect(testEngine.asPlayerOne().playCard(blessedBagpipes)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(blessedBagpipes, {
        resolveOptional: true,
        targets: [megaraSecretKeeper],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(blessedBagpipes)).toBe("play");
    expect(testEngine.getCardsUnder(megaraSecretKeeper)).toEqual([storedCardId]);
  });

  it("regression: BATTLE ANTHEM should NOT trigger when challenging character has no cards under", () => {
    // Bug: Blessed Bagpipes was triggering on every challenge, not just when
    // the challenged character has cards under it.
    const charWithoutCardsUnder = createMockCharacter({
      id: "bagpipes-no-cards-under",
      name: "Character Without Cards Under",
      cost: 3,
      strength: 3,
      willpower: 5,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [blessedBagpipes, { card: charWithoutCardsUnder, exerted: true }],
        deck: 5,
      },
      {
        play: [opponentAttacker],
        deck: 1,
      },
    );

    // Pass to player two's turn
    expect(testEngine.asServer().manualPassTurn()).toBeSuccessfulCommand();

    // Opponent challenges our character that has NO cards under it
    const attackerId = testEngine.findCardInstanceId(opponentAttacker, "play", PLAYER_TWO);
    const defenderId = testEngine.findCardInstanceId(charWithoutCardsUnder, "play", PLAYER_ONE);
    expect(testEngine.asPlayerTwo().challenge(attackerId, defenderId)).toBeSuccessfulCommand();

    // BATTLE ANTHEM should NOT have triggered because the challenged character has no cards under
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("gains 1 lore when one of your characters with a card under it is challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [aladdinPrinceAli],
        hand: [blessedBagpipes],
        inkwell: blessedBagpipes.cost,
        play: [megaraSecretKeeper],
      },
      {
        deck: 1,
        play: [opponentAttacker],
      },
    );

    expect(testEngine.asPlayerOne().playCard(blessedBagpipes)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(blessedBagpipes, {
        resolveOptional: true,
        targets: [megaraSecretKeeper],
      }),
    ).toBeSuccessfulCommand();

    const attacker = testEngine.findCardInstanceId(opponentAttacker, "play", PLAYER_TWO);
    const defender = testEngine.findCardInstanceId(megaraSecretKeeper, "play", PLAYER_ONE);
    testEngine.manualExertCard(defender);
    expect(testEngine.asServer().manualPassTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(attacker, defender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().getBagEffects()[0]).toMatchObject({
      payload: {
        abilityId: "1s8-2",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "gain-lore",
        },
      },
    });
    expect(testEngine.asPlayerOne().resolvePendingByCard(blessedBagpipes)).toBeSuccessfulCommand();
  });
});
