import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { distract } from "../../003/actions/159-distract";
import { flynnRiderHighclimbingRogue } from "./189-flynn-rider-high-climbing-rogue";

const discardCard = createMockCharacter({
  id: "flynn-high-climbing-discard-card",
  name: "Discard Card",
  cost: 1,
});

describe("Flynn Rider - High-Climbing Rogue", () => {
  it("makes an opponent discard after they choose him for an action", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [distract, discardCard],
        inkwell: distract.cost,
        deck: [],
      },
      {
        play: [flynnRiderHighclimbingRogue],
        deck: [],
      },
    );
    const discardCardId = testEngine.findCardInstanceId(discardCard, "hand", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(distract, {
        targets: [flynnRiderHighclimbingRogue],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(flynnRiderHighclimbingRogue),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().respondWith(discardCardId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardCard)).toBe("discard");
  });
});
