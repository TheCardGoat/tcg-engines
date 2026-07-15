import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import type { ZoneId } from "@tcg/lorcana-engine";
import { magicCarpetPhantomRug } from "./183-magic-carpet-phantom-rug";

const illusionCharacter = createMockCharacter({
  id: "magic-carpet-illusion-ally",
  name: "Illusion Ally",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Dreamborn", "Illusion"],
});

const nonIllusionCharacter = createMockCharacter({
  id: "magic-carpet-non-illusion",
  name: "Non-Illusion Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Magic Carpet - Phantom Rug", () => {
  it("should have Vanish ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [magicCarpetPhantomRug],
    });

    const cardUnderTest = testEngine.getCardModel(magicCarpetPhantomRug);
    expect(cardUnderTest.hasVanish).toBe(true);
  });

  describe("SPECTRAL FORCE - Your other Illusion characters gain Challenger +1", () => {
    it("other Illusion characters gain Challenger +1 when Magic Carpet is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicCarpetPhantomRug, illusionCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(illusionCharacter, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(illusionCharacter, "Challenger")).toBe(1);
    });

    it("Magic Carpet does not gain Challenger from its own ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicCarpetPhantomRug],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(magicCarpetPhantomRug, "Challenger")).toBe(false);
    });

    it("non-Illusion characters do not gain Challenger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicCarpetPhantomRug, nonIllusionCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(nonIllusionCharacter, "Challenger")).toBe(false);
    });

    it("Illusion characters lose Challenger +1 when Magic Carpet leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicCarpetPhantomRug, illusionCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(illusionCharacter, "Challenger")).toBe(true);

      const magicCarpetInstanceId = testEngine.findCardInstanceId(
        magicCarpetPhantomRug,
        "play",
        PLAYER_ONE,
      );
      testEngine
        .asServer()
        .manualMoveCard(magicCarpetInstanceId, `discard:${PLAYER_ONE}` as ZoneId);

      expect(testEngine.asPlayerOne().hasKeyword(illusionCharacter, "Challenger")).toBe(false);
    });

    it("Illusion characters do not have Challenger when Magic Carpet is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [illusionCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(illusionCharacter, "Challenger")).toBe(false);
    });
  });
});
