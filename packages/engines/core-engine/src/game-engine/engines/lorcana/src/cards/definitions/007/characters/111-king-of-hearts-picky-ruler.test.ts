import { describe, expect, it } from "bun:test";
import { captainHookForcefulDuelist } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  madamMimFox,
  madamMimSnake,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { bellesHouseMauricesWorkshop } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations";
import { hiddenCoveTranquilHaven } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations";
import {
  denahiImpatientHunter,
  kingOfHeartsPickyRuler,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("King Of Hearts - Picky Ruler", () => {
  it("OBJECTIONABLE STATE Damaged characters can't challenge your characters.", async () => {
    const testEngine = new TestEngine(
      {
        play: [
          kingOfHeartsPickyRuler,
          mrSmeeBumblingMate,
          captainHookForcefulDuelist,
          hiddenCoveTranquilHaven,
        ],
      },
      {
        play: [madamMimFox, madamMimSnake],
      },
    );

    await testEngine.setCardDamage(madamMimFox, 1);

    await testEngine.tapCard(mrSmeeBumblingMate);
    await testEngine.tapCard(captainHookForcefulDuelist);

    await testEngine.challenge({
      attacker: madamMimFox,
      defender: mrSmeeBumblingMate,
    });
    expect(testEngine.getCardModel(mrSmeeBumblingMate).damage).toBe(0);

    await testEngine.challenge({
      attacker: madamMimFox,
      defender: hiddenCoveTranquilHaven,
    });
    expect(testEngine.getCardModel(hiddenCoveTranquilHaven).damage).toBe(4);

    await testEngine.challenge({
      attacker: madamMimSnake,
      defender: mrSmeeBumblingMate,
    });
    expect(testEngine.getCardZone(mrSmeeBumblingMate)).toBe("discard");
    expect(testEngine.getCardZone(madamMimSnake)).toBe("discard");
  });
});

describe("Regression", () => {
  it("Characters with Reckless affect by the effect should NOT prevent players passing the turn.", async () => {
    const testEngine = new TestEngine(
      {
        play: [denahiImpatientHunter],
      },
      {
        play: [kingOfHeartsPickyRuler],
      },
    );

    const denahi = testEngine.getCardModel(denahiImpatientHunter);
    const king = testEngine.getCardModel(kingOfHeartsPickyRuler);

    await testEngine.tapCard(kingOfHeartsPickyRuler);

    expect(denahi.canChallenge(king)).toBeTruthy();
    expect(denahi.hasChallengeCharactersRestriction).toBeFalsy();
    expect(denahi.hasChallengeRestriction).toBeFalsy();

    await testEngine.setCardDamage(denahiImpatientHunter, 1);

    // Challenge restriction is only true when they're unable to challenge at all
    expect(denahi.hasChallengeRestriction).toBeFalsy();
    expect(denahi.hasChallengeCharactersRestriction).toBeTruthy();
    expect(denahi.canChallenge(king)).toBeFalsy();

    expect(testEngine.store.turnCount).toEqual(0);
    await testEngine.passTurn();
    expect(testEngine.store.turnCount).toEqual(1);
  });

  it("Characters with Reckless affect by the effect should prevent players passing the turn if there's location in play.", async () => {
    const testEngine = new TestEngine(
      {
        play: [denahiImpatientHunter],
      },
      {
        play: [kingOfHeartsPickyRuler, bellesHouseMauricesWorkshop],
      },
    );

    const denahi = testEngine.getCardModel(denahiImpatientHunter);
    const king = testEngine.getCardModel(kingOfHeartsPickyRuler);
    const location = testEngine.getCardModel(bellesHouseMauricesWorkshop);

    await testEngine.tapCard(kingOfHeartsPickyRuler);

    expect(denahi.canChallenge(king)).toBeTruthy();
    expect(denahi.hasChallengeCharactersRestriction).toBeFalsy();
    expect(denahi.hasChallengeRestriction).toBeFalsy();
    expect(denahi.canChallenge(location)).toBeTruthy();

    await testEngine.setCardDamage(denahiImpatientHunter, 1);

    // Challenge restriction is only true when they're unable to challenge at all
    expect(denahi.hasChallengeRestriction).toBeFalsy();
    expect(denahi.hasChallengeCharactersRestriction).toBeTruthy();
    expect(denahi.canChallenge(king)).toBeFalsy();
    expect(denahi.canChallenge(location)).toBeTruthy();

    expect(testEngine.store.turnCount).toEqual(0);
    await testEngine.passTurn();
    expect(testEngine.store.turnCount).toEqual(0);
  });
});
