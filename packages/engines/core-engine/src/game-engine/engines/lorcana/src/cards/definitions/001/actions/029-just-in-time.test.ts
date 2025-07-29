import { describe, expect, it } from "bun:test";
import { justInTime } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  captainColonelsLieutenant,
  simbaProtectiveCub,
  teKaTheBurningOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Just in Time", () => {
  describe("Costs <= 5", () => {
    it("Plays character card for free", async () => {
      const testEngine = new TestEngine({
        inkwell: justInTime.cost,
        hand: [justInTime, captainColonelsLieutenant],
      });

      await testEngine.playCard(justInTime, {
        acceptOptionalLayer: true,
        targets: [captainColonelsLieutenant],
      });

      expect(testEngine.getCardModel(justInTime).zone).toEqual("discard");
      expect(testEngine.getCardModel(captainColonelsLieutenant).zone).toEqual(
        "play",
      );
    });

    it("Characters with Bodyguard can be played exerted", async () => {
      const testEngine = new TestEngine({
        inkwell: justInTime.cost,
        hand: [justInTime, simbaProtectiveCub],
      });

      await testEngine.playCard(
        justInTime,
        {
          acceptOptionalLayer: true,
          targets: [simbaProtectiveCub],
        },
        true,
      );
      expect(testEngine.getCardModel(simbaProtectiveCub).zone).toEqual("play");
      expect(testEngine.getCardModel(simbaProtectiveCub).exerted).toEqual(
        false,
      );

      await testEngine.acceptOptionalLayer();

      expect(testEngine.getCardModel(simbaProtectiveCub).exerted).toEqual(true);
    });

    it("Characters with Bodyguard can be played ready", async () => {
      const testEngine = new TestEngine({
        inkwell: justInTime.cost,
        hand: [justInTime, simbaProtectiveCub],
      });

      await testEngine.playCard(
        justInTime,
        {
          acceptOptionalLayer: true,
          targets: [simbaProtectiveCub],
        },
        true,
      );
      expect(testEngine.getCardModel(simbaProtectiveCub).zone).toEqual("play");
      expect(testEngine.getCardModel(simbaProtectiveCub).exerted).toEqual(
        false,
      );

      await testEngine.skipTopOfStack();

      expect(testEngine.getCardModel(simbaProtectiveCub).exerted).toEqual(
        false,
      );
    });
  });

  describe("Costs > 5", () => {
    it("Doesn't play for free", () => {
      const testStore = new TestStore({
        inkwell: justInTime.cost,
        hand: [justInTime, teKaTheBurningOne],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", justInTime.id);
      const target = testStore.getByZoneAndId("hand", teKaTheBurningOne.id);

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      expect(cardUnderTest.zone).toEqual("discard");

      testStore.resolveTopOfStack({ targetId: target.instanceId });
      expect(target.zone).toEqual("hand");

      // TODO: We still have to decide what to do with the stack, when there's no valid target.
      // Ideally we should not be able to play the card, but this would require to check valid targets before playing the card
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });

    it.skip("Doesn't shift character card for free", () => {
      throw new Error("Not implemented");
    });
  });
});
