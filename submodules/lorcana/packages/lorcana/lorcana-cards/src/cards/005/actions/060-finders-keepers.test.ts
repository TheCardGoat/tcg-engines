import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { hakunaMatata, simbaProtectiveCub, tinkerBellPeterPansAlly } from "../../001";
import { findersKeepers } from "./060-finders-keepers";

describe("Finders Keepers", () => {
  it("draws 3 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [findersKeepers],
      inkwell: findersKeepers.cost,
      deck: [simbaProtectiveCub, tinkerBellPeterPansAlly, hakunaMatata],
    });

    expect(testEngine.asPlayerOne().playCard(findersKeepers)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(3);
  });
});
