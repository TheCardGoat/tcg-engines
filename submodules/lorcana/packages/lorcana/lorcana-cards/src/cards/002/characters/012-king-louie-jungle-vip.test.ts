import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { kingLouieJungleVip } from "./012-king-louie-jungle-vip";
import { aladdinStreetRat } from "../../001/characters/105-aladdin-street-rat";

describe("King Louie - Jungle VIP", () => {
  it("LAY IT ON THE LINE - When another character is banished, remove up to 2 damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: kingLouieJungleVip, damage: 3 }, { card: aladdinStreetRat }],
    });

    const kingId = testEngine.findCardInstanceId(kingLouieJungleVip, "play");
    const aladdinId = testEngine.findCardInstanceId(aladdinStreetRat, "play");

    // Deal lethal damage
    testEngine.asServer().manualSetDamage(aladdinId, 10);

    // Pass turn to force state check and banishment
    testEngine.asServer().passTurn();

    // Resolve the trigger as Player 1 (Controller of King Louie)
    testEngine.asPlayerOne().resolvePendingByCard(kingLouieJungleVip);

    // Verify damage is reduced
    const king = testEngine.asServer().getCard(kingId);
    expect(king.damage).toBeLessThan(3);
    expect(king.damage).toBe(1);
  });
});
