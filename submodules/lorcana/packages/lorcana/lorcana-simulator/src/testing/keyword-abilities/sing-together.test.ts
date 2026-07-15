import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielSpectacularSinger, mulanImperialSoldier } from "@tcg/lorcana-cards/cards/001";
import { mauiSoaringDemigod, wildcatMechanic } from "@tcg/lorcana-cards/cards/003";
import { i2i } from "@tcg/lorcana-cards/cards/009";
import { shantiVillageGirl } from "@tcg/lorcana-cards/cards/010";

describe("Sing Together - I2I - Sing Together 9 (Any number of your characters with total cost 9 or more may exert to sing this song for free.)", () => {
  it("Combined cost of singers meets the Sing Together threshold", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [i2i],
      discard: [i2i],
      play: [mauiSoaringDemigod, wildcatMechanic, mulanImperialSoldier],
    });

    // Maui (5) + Wildcat (2) + Mulan (3) = 10, meets Sing Together 9
    expect(
      testEngine
        .asPlayerOne()
        .playSongTogether(i2i, [mauiSoaringDemigod, wildcatMechanic, mulanImperialSoldier]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(i2i)).toBe("discard");
  });

  it("Singers with Singer ability can use their alternate cost value for Sing Together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [i2i],
      discard: [i2i],
      play: [arielSpectacularSinger, shantiVillageGirl],
    });

    // Ariel Singer 5 + Shanti Singer 5 = 10, meets Sing Together 9
    expect(
      testEngine.asPlayerOne().playSongTogether(i2i, [arielSpectacularSinger, shantiVillageGirl]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(i2i)).toBe("discard");
  });

  it.todo("Each singer counts as singing the song (triggers 'whenever this character sings')", () => {});

  it.todo("Sing Together fails if combined cost of singers is below the threshold", () => {});

  it.todo("Drying characters cannot participate in Sing Together", () => {});
});
