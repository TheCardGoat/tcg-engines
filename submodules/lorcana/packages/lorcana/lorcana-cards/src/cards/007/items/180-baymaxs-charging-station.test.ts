import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { frecklesGoodBoy } from "../characters/168-freckles-good-boy";
import { thunderboltWonderDog } from "../characters/023-thunderbolt-wonder-dog";
import { baymaxsChargingStation } from "./180-baymaxs-charging-station";

const drawnCard = createMockCharacter({
  id: "baymaxs-charging-station-drawn-card",
  name: "Baymax's Charging Station Drawn Card",
  cost: 1,
});

describe("Baymax's Charging Station", () => {
  it("may draw a card when you play a Floodborn character using Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [thunderboltWonderDog],
      inkwell: 3,
      play: [baymaxsChargingStation, { card: frecklesGoodBoy, isDrying: false }],
    });

    const shiftTarget = testEngine.findCardInstanceId(frecklesGoodBoy, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(thunderboltWonderDog, {
        cost: {
          cost: "shift",
          shiftTarget,
        },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(baymaxsChargingStation, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  });

  it("does not draw a card when the Floodborn character is played normally", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [thunderboltWonderDog],
      inkwell: thunderboltWonderDog.cost,
      play: [baymaxsChargingStation],
    });

    expect(testEngine.asPlayerOne().playCard(thunderboltWonderDog)).toBeSuccessfulCommand();
    // Shift was not used — condition fails, engine auto-cancels the bag effect (CRD 6.2.7).
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
  });
});
