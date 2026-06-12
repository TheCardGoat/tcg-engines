import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { whiteRabbitRoyalHerald } from "./043-white-rabbit-royal-herald";

describe("White Rabbit - Royal Herald", () => {
  it("is a vanilla 3/3/4/1 character", () => {
    expect(whiteRabbitRoyalHerald.cost).toBe(3);
    expect(whiteRabbitRoyalHerald.strength).toBe(3);
    expect(whiteRabbitRoyalHerald.willpower).toBe(4);
    expect(whiteRabbitRoyalHerald.lore).toBe(1);
    expect(whiteRabbitRoyalHerald.vanilla).toBe(true);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [whiteRabbitRoyalHerald],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(whiteRabbitRoyalHerald)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 1);
  });
});
