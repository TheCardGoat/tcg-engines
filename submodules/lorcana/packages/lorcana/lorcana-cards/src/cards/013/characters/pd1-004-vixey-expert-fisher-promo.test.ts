import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { vixeyExpertFisherPD1Promo } from "./pd1-004-vixey-expert-fisher-promo";

const evasiveAlly = createMockCharacter({
  id: "vixey-expert-fisher-evasive-ally",
  name: "Evasive Ally",
  cost: 2,
  abilities: [evasive],
});

const cheapCharacter = createMockCharacter({
  id: "vixey-expert-fisher-cheap-character",
  name: "Cheap Character",
  cost: 2,
});

describe("Vixey - Expert Fisher", () => {
  it("returns a cheap chosen card to hand when you have an Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [vixeyExpertFisherPD1Promo],
      inkwell: vixeyExpertFisherPD1Promo.cost,
      play: [evasiveAlly, cheapCharacter],
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(vixeyExpertFisherPD1Promo)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(vixeyExpertFisherPD1Promo, {
        resolveOptional: true,
        targets: [cheapCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("hand");
  });
});
