import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { healingGlow, peterPanNeverLanding } from "../../001";
import { vixeyForestFriend } from "../characters/086-vixey-forest-friend";
import { snowballFight } from "./095-snowball-fight";

describe("Snowball Fight", () => {
  it("makes each opponent discard a card and gains lore when you have Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [snowballFight],
        inkwell: snowballFight.cost,
        play: [peterPanNeverLanding],
      },
      {
        hand: [healingGlow],
      },
    );
    const healingGlowId = testEngine.findCardInstanceId(healingGlow, "hand", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(snowballFight)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWith(healingGlowId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(healingGlow)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });

  it("regression: grants 1 lore when Vixey - Forest Friend (Evasive) is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [snowballFight],
        inkwell: snowballFight.cost,
        play: [vixeyForestFriend],
      },
      {
        hand: [healingGlow],
      },
    );
    const healingGlowId = testEngine.findCardInstanceId(healingGlow, "hand", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(snowballFight)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWith(healingGlowId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(healingGlow)).toBe("discard");
    // Should gain 1 lore because Vixey has Evasive
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
