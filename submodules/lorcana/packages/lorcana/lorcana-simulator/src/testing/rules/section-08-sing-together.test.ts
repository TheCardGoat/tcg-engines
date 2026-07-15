// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielSpectacularSinger, mulanImperialSoldier } from "@tcg/lorcana-cards/cards/001";
import {
  mauiSoaringDemigod,
  ursulaDeceiverOfAll,
  wildcatMechanic,
} from "@tcg/lorcana-cards/cards/003";
import { i2i } from "@tcg/lorcana-cards/cards/009";
import { shantiVillageGirl } from "@tcg/lorcana-cards/cards/010";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.12. Sing Together", () => {
    it("8.12.2 / 8.12.3. Sing Together adds singers' costs together, and each singer still counts as singing the song.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [i2i],
        discard: [i2i],
        play: [mauiSoaringDemigod, wildcatMechanic, mulanImperialSoldier],
      });

      expect(
        testEngine
          .asPlayerOne()
          .playSongTogether(i2i, [mauiSoaringDemigod, wildcatMechanic, mulanImperialSoldier]),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(i2i)).toBe("discard");
    });
  });

  it("Singers can use alternate cost to pay for singing together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [i2i],
      discard: [i2i],
      play: [arielSpectacularSinger, shantiVillageGirl],
    });

    expect(
      testEngine.asPlayerOne().playSongTogether(i2i, [arielSpectacularSinger, shantiVillageGirl]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(i2i)).toBe("discard");
  });
});
