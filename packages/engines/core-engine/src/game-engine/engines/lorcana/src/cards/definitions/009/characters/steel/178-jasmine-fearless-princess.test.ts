import { describe, expect, it } from "bun:test";
import { jasmineDisguised } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/148-jasmine-disguised";
import { jasmineFearlessPrincess } from "~/game-engine/engines/lorcana/src/cards/definitions/009";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jasmine - Fearless Princess", () => {
  it("TAKE THE LEAP During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
    const testEngine = new TestEngine({
      play: [jasmineFearlessPrincess],
    });

    expect(testEngine.getCardModel(jasmineFearlessPrincess).hasEvasive).toBe(
      true,
    );

    await testEngine.passTurn();

    expect(testEngine.getCardModel(jasmineFearlessPrincess).hasEvasive).toBe(
      false,
    );
  });

  it("NOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)", async () => {
    const testEngine = new TestEngine({
      play: [jasmineFearlessPrincess],
      hand: [jasmineDisguised],
    });

    expect(testEngine.getCardModel(jasmineFearlessPrincess).hasChallenger).toBe(
      false,
    );

    await testEngine.activateCard(jasmineFearlessPrincess, {
      costs: [jasmineDisguised],
    });

    expect(testEngine.getCardModel(jasmineFearlessPrincess).hasChallenger).toBe(
      true,
    );
  });
});
