import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaScrappyCub } from "../characters";
import { theSorcerersHatEnchanted } from "./210-the-sorcerers-hat-enchanted";

describe("The Sorcerer's Hat (Enchanted)", () => {
  it("uses the same incredible energy ability as the base printing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [simbaScrappyCub],
      inkwell: 1,
      play: [theSorcerersHatEnchanted],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theSorcerersHatEnchanted, {
        ability: "INCREDIBLE ENERGY",
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(theSorcerersHatEnchanted, {
        namedCard: "Simba",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(theSorcerersHatEnchanted)).toBe(true);
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 0 });
    expect(testEngine.asPlayerOne().getCardZone(simbaScrappyCub)).toBe("hand");
  });
});
