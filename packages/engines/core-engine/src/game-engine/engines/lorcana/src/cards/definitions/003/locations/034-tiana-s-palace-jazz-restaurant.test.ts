import { describe, expect, it } from "bun:test";
import {
  genieSupportiveFriend,
  hydrosIceTitan,
  iagoPrettyPolly,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { tianasPalaceJazzRestaurant } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tiana's Palace - Jazz Restaurant", () => {
  it("**NIGHT OUT** Characters can't be challenged while here.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: tianasPalaceJazzRestaurant.moveCost * 2,
        play: [
          tianasPalaceJazzRestaurant,
          genieSupportiveFriend,
          hydrosIceTitan,
        ],
      },
      {
        play: [iagoPrettyPolly],
        deck: 3,
      },
    );

    await testEngine.tapCard(hydrosIceTitan);
    await testEngine.tapCard(genieSupportiveFriend);

    const attacker = testEngine.getCardModel(iagoPrettyPolly);
    const notAtLocation = testEngine.getCardModel(hydrosIceTitan);
    const atLocation = testEngine.getCardModel(genieSupportiveFriend);

    expect(attacker.canChallenge(atLocation)).toBe(true);

    await testEngine.moveToLocation({
      location: tianasPalaceJazzRestaurant,
      character: genieSupportiveFriend,
    });

    await testEngine.passTurn();

    expect(attacker.canChallenge(notAtLocation)).toBe(true);
    expect(attacker.canChallenge(atLocation)).toBe(false);
  });
});
