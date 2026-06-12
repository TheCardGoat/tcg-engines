import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { annaBravingTheStorm } from "./146-anna-braving-the-storm";
import { arielSingingMermaid } from "./015-ariel-singing-mermaid";
import { theQueenConceitedRuler } from "./001-the-queen-conceited-ruler";

describe("Anna - Braving the Storm (set 9)", () => {
  it("I WAS BORN READY - Gets +1 Lore while you have another Hero character in play", () => {
    // Scenario 1: Anna alone with a non-Hero (no lore bonus)
    const engine1 = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: annaBravingTheStorm },
        { card: theQueenConceitedRuler }, // Villain, not a Hero
      ],
    });

    const annaId1 = engine1.findCardInstanceId(annaBravingTheStorm, "play");
    // No other Hero: base lore of 1
    expect(engine1.asServer().getCard(annaId1).lore).toBe(1);

    // Scenario 2: Anna + another Hero character
    const engine2 = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: annaBravingTheStorm },
        { card: arielSingingMermaid }, // Hero
      ],
    });

    const annaId2 = engine2.findCardInstanceId(annaBravingTheStorm, "play");
    // Anna + Ariel (Hero): 1 base + 1 = 2
    expect(engine2.asServer().getCard(annaId2).lore).toBe(2);
  });
});
