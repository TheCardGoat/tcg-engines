import { describe, expect, it } from "bun:test";
import {
  annaDiplomaticQueen,
  edLaughingHyena,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Anna - Diplomatic Queen", () => {
  describe("**ROYAL RESOLUTION** When you play this character you may pay 2 {I} to chose one:* Each opponent choses and discards a card.* Chosen character gets +2 {S} this turn. * Banish chosen damaged character.", () => {
    it("you MUST pay 2 {I} to chose one", () => {
      const testStore = new TestStore(
        {
          inkwell: annaDiplomaticQueen.cost,
          hand: [annaDiplomaticQueen],
        },
        {
          hand: [edLaughingHyena],
          deck: 1,
        },
      );

      const cardUnderTest = testStore.getCard(annaDiplomaticQueen);
      const target = testStore.getCard(edLaughingHyena);

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ mode: "1" }, true);

      expect(testStore.stackLayers).toHaveLength(0);
    });

    it("Each opponent chooses and discards a card.", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: annaDiplomaticQueen.cost + 2,
          hand: [annaDiplomaticQueen],
        },
        {
          hand: [edLaughingHyena],
          deck: 1,
        },
      );

      const target = testEngine.getCardModel(edLaughingHyena);

      await testEngine.playCard(annaDiplomaticQueen);
      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ mode: "1" }, true);

      expect(testEngine.store.priorityPlayer).toEqual("player_two");
      testEngine.changeActivePlayer("player_two");
      await testEngine.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toBe("discard");
    });

    it("Chosen character gets +2 {S} this turn.", () => {
      const testStore = new TestStore(
        {
          inkwell: annaDiplomaticQueen.cost + 2,
          hand: [annaDiplomaticQueen],
          play: [edLaughingHyena],
        },
        {
          deck: 1,
        },
      );

      const cardUnderTest = testStore.getCard(annaDiplomaticQueen);
      const target = testStore.getCard(edLaughingHyena);

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ mode: "2" }, true);
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.strength).toBe(edLaughingHyena.strength + 2);

      testStore.passTurn();

      expect(target.strength).toBe(edLaughingHyena.strength);
    });

    it("Banish chosen damaged character.", () => {
      const testStore = new TestStore(
        {
          inkwell: annaDiplomaticQueen.cost + 2,
          hand: [annaDiplomaticQueen],
          play: [edLaughingHyena],
        },
        {
          deck: 1,
        },
      );

      const cardUnderTest = testStore.getCard(annaDiplomaticQueen);
      const target = testStore.getCard(edLaughingHyena);
      target.updateCardMeta({ damage: 1 });

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ mode: "3" }, true);
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toBe("discard");
    });
  });
});

describe("Regression", () => {
  it("should not crash when playing a card with no cost", async () => {
    const testEngine = new TestEngine({
      inkwell: annaDiplomaticQueen.cost + 2,
      hand: [annaDiplomaticQueen],
      play: [edLaughingHyena],
    });

    const cardUnderTest = await testEngine.playCard(annaDiplomaticQueen);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ mode: "2" }, true);
    await testEngine.resolveTopOfStack({ targets: [edLaughingHyena] });

    expect(testEngine.getCardModel(edLaughingHyena).strength).toBe(
      edLaughingHyena.strength + 2,
    );
  });
});
