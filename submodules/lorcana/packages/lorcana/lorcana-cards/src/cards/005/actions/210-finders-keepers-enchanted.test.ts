import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { hakunaMatata, simbaProtectiveCub, tinkerBellPeterPansAlly } from "../../001";
import { findersKeepersEnchanted } from "./210-finders-keepers-enchanted";

describe("Finders Keepers Enchanted", () => {
  it("draws 3 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [findersKeepersEnchanted],
      inkwell: findersKeepersEnchanted.cost,
      deck: [simbaProtectiveCub, tinkerBellPeterPansAlly, hakunaMatata],
    });

    expect(testEngine.asPlayerOne().playCard(findersKeepersEnchanted)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(3);
  });
});
