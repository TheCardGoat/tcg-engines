import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { annaBravingTheStormEpic } from "./218-anna-braving-the-storm-epic";
import { mickeyMouseTrueFriend } from "./013-mickey-mouse-true-friend";
import { hansNobleScoundrel } from "./148-hans-noble-scoundrel";

describe("Anna - Braving the Storm (Epic)", () => {
  it("I WAS BORN READY - Gets +1 Lore while you have another Hero character in play", () => {
    // Scenario 1: Anna alone with a Villain (no other Hero)
    const engine1 = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: annaBravingTheStormEpic },
        { card: hansNobleScoundrel }, // Villain, not a Hero
      ],
    });

    const annaId1 = engine1.findCardInstanceId(annaBravingTheStormEpic, "play");
    // No other Hero: base lore of 1
    expect(engine1.asServer().getCard(annaId1).lore).toBe(1);

    // Scenario 2: Anna + another Hero character
    const engine2 = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: annaBravingTheStormEpic },
        { card: mickeyMouseTrueFriend }, // Hero
      ],
    });

    const annaId2 = engine2.findCardInstanceId(annaBravingTheStormEpic, "play");
    // Anna + Mickey (Hero): 1 base + 1 = 2
    expect(engine2.asServer().getCard(annaId2).lore).toBe(2);
  });
});
