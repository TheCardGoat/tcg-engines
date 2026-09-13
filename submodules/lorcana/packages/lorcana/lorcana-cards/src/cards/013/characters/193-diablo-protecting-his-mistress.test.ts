import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cardHasName } from "@tcg/lorcana-engine";
import { diabloProtectingHisMistress } from "./193-diablo-protecting-his-mistress";
import { maleficentDiabloEvilIncarnate } from "./063-maleficent-diablo-evil-incarnate";

const plainMaleficent = createMockCharacter({
  id: "diablo-plain-maleficent",
  name: "Maleficent",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Diablo - Protecting His Mistress", () => {
  it("grants Resist +1 to a character named Maleficent", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [diabloProtectingHisMistress, plainMaleficent],
    });

    expect(testEngine.asPlayerOne().getKeywordValue(plainMaleficent, "Resist")).toBe(1);
  });

  it("grants Resist +1 to Maleficent & Diablo duo (ampersand name parts)", () => {
    // bugrep9te7ug8gANFSPbyi3LeaC
    expect(cardHasName(maleficentDiabloEvilIncarnate, "Maleficent")).toBe(true);

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [diabloProtectingHisMistress, maleficentDiabloEvilIncarnate],
    });

    expect(testEngine.asPlayerOne().getKeywordValue(maleficentDiabloEvilIncarnate, "Resist")).toBe(
      1,
    );
  });
});
