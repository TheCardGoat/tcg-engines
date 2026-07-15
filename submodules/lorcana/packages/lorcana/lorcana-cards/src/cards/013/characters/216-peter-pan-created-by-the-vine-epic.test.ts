import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { peterPanCreatedByTheVineEpic } from "./216-peter-pan-created-by-the-vine-epic";

const floodbornDefender = createMockCharacter({
  id: "peter-pan-vine-floodborn-defender",
  name: "Floodborn Defender",
  cost: 3,
  strength: 2,
  willpower: 4,
  classifications: ["Floodborn", "Hero"],
});

const attacker = createMockCharacter({
  id: "peter-pan-vine-attacker",
  name: "Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const discardCard = createMockCharacter({
  id: "peter-pan-vine-discard-card",
  name: "Discard Card",
  cost: 1,
});

describe("Peter Pan - Created by the Vine", () => {
  it("makes the challenging player discard when one of your Floodborn characters is challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: attacker, isDrying: false }],
        hand: [discardCard],
        deck: [],
      },
      {
        play: [peterPanCreatedByTheVineEpic, { card: floodbornDefender, exerted: true }],
        deck: [],
      },
    );
    const discardCardId = testEngine.findCardInstanceId(discardCard, "hand", PLAYER_ONE);

    expect(testEngine.asPlayerOne().challenge(attacker, floodbornDefender)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(peterPanCreatedByTheVineEpic),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().respondWith(discardCardId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardCard)).toBe("discard");
  });
});
