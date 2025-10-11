import { describe, expect, it } from "bun:test";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { herculesDaringDemigod } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hercules - Daring Demigod", () => {
  it("**Rush** _(This character can challenge the turn they're played.)_**Reckless** _(This character can't quest and must challenge each turn if able.)_", () => {
    const testStore = new TestStore({
      play: [herculesDaringDemigod],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      herculesDaringDemigod.id,
    );
    expect(cardUnderTest.hasRush).toBe(true);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});

describe("Regression", () => {
  it("Can challenge with fresh ink", () => {
    const testStore = new TestStore(
      {
        inkwell: herculesDaringDemigod.cost,
        hand: [herculesDaringDemigod],
      },
      {
        play: [moanaOfMotunui],
      },
    );

    const attacker = testStore.getByZoneAndId("hand", herculesDaringDemigod.id);
    testStore.store.playCardFromHand(attacker.instanceId);

    const defender = testStore.getCard(moanaOfMotunui);
    defender.updateCardMeta({ exerted: true });

    attacker.challenge(defender);

    expect(
      testStore.store.tableStore.getTable("player_one").turn.challenges,
    ).toHaveLength(1);
    expect(attacker.meta.damage).toEqual(1);
    expect(defender.zone).toEqual("discard");
  });
});
