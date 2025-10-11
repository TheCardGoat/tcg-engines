import { describe, expect, it } from "bun:test";
import { aPiratesLife } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { princeNaveenUkulelePlayer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  gantuExperiencedEnforcer,
  mickeyMouseInspirationalWarrior,
  mirabelMadrigalHopefulDreamer,
  restoringTheHeart,
  spaghettiDinner,
  theFamilyMadrigal,
  theTroubadourMusicalNarrator,
  thunderboltWonderDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007/";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gantu - Experienced Enforcer", () => {
  it("CLOSE ALL CHANNELS When you play this character, characters can’t exert to sing songs until the start of your next turn.", async () => {
    const testEngine = new TestEngine(
      {
        deck: 2,
        inkwell: gantuExperiencedEnforcer.cost,
        play: [theTroubadourMusicalNarrator],
        hand: [gantuExperiencedEnforcer],
      },
      {
        deck: 2,
        play: [mirabelMadrigalHopefulDreamer],
      },
    );

    const singer = testEngine.getCardModel(theTroubadourMusicalNarrator);
    const anotherSinger = testEngine.getCardModel(
      mirabelMadrigalHopefulDreamer,
    );

    expect(singer.hasSingRestriction).toBe(false);
    expect(anotherSinger.hasSingRestriction).toBe(false);

    await testEngine.playCard(gantuExperiencedEnforcer);

    expect(singer.hasSingRestriction).toBe(true);
    expect(anotherSinger.hasSingRestriction).toBe(true);

    await testEngine.passTurn();

    expect(singer.hasSingRestriction).toBe(true);
    expect(anotherSinger.hasSingRestriction).toBe(true);

    await testEngine.passTurn();

    expect(singer.hasSingRestriction).toBe(false);
    expect(anotherSinger.hasSingRestriction).toBe(false);
  });

  describe("DON'T GET ANY IDEAS Each player pays 2 {I} more to play actions or items. (This doesn’t apply to singing songs.)", () => {
    it("[Active Player] Increase cost for items and actions, but not for characters", async () => {
      const testEngine = new TestEngine({
        play: [gantuExperiencedEnforcer],
        hand: [
          mickeyMouseInspirationalWarrior,
          spaghettiDinner,
          restoringTheHeart,
        ],
      });

      expect(
        testEngine.getCardModel(mickeyMouseInspirationalWarrior).cost,
      ).toBe(mickeyMouseInspirationalWarrior.cost);
      expect(testEngine.getCardModel(spaghettiDinner).cost).toBe(
        spaghettiDinner.cost + 2,
      );
      expect(testEngine.getCardModel(restoringTheHeart).cost).toBe(
        restoringTheHeart.cost + 2,
      );
    });

    it("[Opponent] Increase cost for items and actions, but not for characters", async () => {
      const testEngine = new TestEngine(
        {
          hand: [
            mickeyMouseInspirationalWarrior,
            spaghettiDinner,
            restoringTheHeart,
          ],
        },
        {
          play: [gantuExperiencedEnforcer],
        },
      );

      expect(
        testEngine.getCardModel(mickeyMouseInspirationalWarrior).cost,
      ).toBe(mickeyMouseInspirationalWarrior.cost);
      expect(testEngine.getCardModel(spaghettiDinner).cost).toBe(
        spaghettiDinner.cost + 2,
      );
      expect(testEngine.getCardModel(restoringTheHeart).cost).toBe(
        restoringTheHeart.cost + 2,
      );
    });

    it("Effect Accumulates", async () => {
      const testEngine = new TestEngine(
        {
          hand: [
            mickeyMouseInspirationalWarrior,
            spaghettiDinner,
            restoringTheHeart,
          ],
        },
        {
          play: [gantuExperiencedEnforcer, gantuExperiencedEnforcer],
        },
      );

      expect(
        testEngine.getCardModel(mickeyMouseInspirationalWarrior).cost,
      ).toBe(mickeyMouseInspirationalWarrior.cost);
      expect(testEngine.getCardModel(spaghettiDinner).cost).toBe(
        spaghettiDinner.cost + 4,
      );
      expect(testEngine.getCardModel(restoringTheHeart).cost).toBe(
        restoringTheHeart.cost + 4,
      );
    });

    it("This doesn't apply to singing songs.", async () => {
      const testEngine = new TestEngine(
        {
          hand: [theFamilyMadrigal],
          play: [thunderboltWonderDog],
        },
        {
          play: [gantuExperiencedEnforcer],
        },
      );

      expect(testEngine.getCardModel(theFamilyMadrigal).cost).toBe(
        theFamilyMadrigal.cost + 2,
      );

      expect(
        testEngine
          .getCardModel(thunderboltWonderDog)
          .canSingASong(testEngine.getCardModel(theFamilyMadrigal)),
      ).toBe(true);

      await testEngine.singSong({
        singer: thunderboltWonderDog,
        song: theFamilyMadrigal,
      });

      expect(testEngine.getCardModel(thunderboltWonderDog).exerted).toEqual(
        true,
      );
      expect(testEngine.getCardModel(theFamilyMadrigal).zone).toEqual(
        "discard",
      );
    });
  });
});

describe("Regression tests", () => {
  it("Prince Naveen - Ukulele Player + Gantu - Experienced Enforcer", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: princeNaveenUkulelePlayer.cost,
        hand: [princeNaveenUkulelePlayer, aPiratesLife],
      },
      {
        play: [gantuExperiencedEnforcer],
      },
    );

    await testEngine.playCard(princeNaveenUkulelePlayer);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [aPiratesLife] });

    expect(testEngine.getCardModel(aPiratesLife).zone).toBe("discard");
    expect(testEngine.getCardModel(princeNaveenUkulelePlayer).zone).toBe(
      "play",
    );
  });
});
