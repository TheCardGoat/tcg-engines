import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { annaBravingTheStorm } from "./137-anna-braving-the-storm";
import { arielTreasureCollector } from "./139-ariel-treasure-collector";
import { hansNobleScoundrel } from "./146-hans-noble-scoundrel";

describe("Anna - Braving the Storm", () => {
  it("I WAS BORN READY - Gets +1 Lore while you have another Hero character in play", () => {
    // Scenario 1: Anna alone (no other Hero)
    const engine1 = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: annaBravingTheStorm },
        { card: hansNobleScoundrel }, // Villain, not a Hero
      ],
    });

    const annaId1 = engine1.findCardInstanceId(annaBravingTheStorm, "play");
    // No other Hero: base lore of 1
    expect(engine1.asServer().getCard(annaId1).lore).toBe(1);

    // Scenario 2: Anna + another Hero character
    const engine2 = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: annaBravingTheStorm },
        { card: arielTreasureCollector }, // Hero
      ],
    });

    const annaId2 = engine2.findCardInstanceId(annaBravingTheStorm, "play");
    // Anna + Ariel (Hero): 1 base + 1 = 2
    expect(engine2.asServer().getCard(annaId2).lore).toBe(2);
  });
});
