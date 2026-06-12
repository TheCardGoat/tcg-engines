import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { casaMadrigalCourtyard } from "./170-casa-madrigal-courtyard";

const woundedQuester = createMockCharacter({
  id: "casa-courtyard-quester",
  name: "Wounded Quester",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Casa Madrigal - Courtyard", () => {
  it("HEALING HOME - removes up to 2 damage from the questing character and then up to 2 from this location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: casaMadrigalCourtyard, damage: 3 },
        { card: woundedQuester, atLocation: casaMadrigalCourtyard, damage: 2 },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(woundedQuester)).toBeSuccessfulCommand();

    // Resolve the triggered ability's sequence of two optional heals in one shot.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(casaMadrigalCourtyard, {
        resolveOptional: true,
        amount: 2,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(woundedQuester)?.damage).toBe(0);
    expect(testEngine.asPlayerOne().getCard(casaMadrigalCourtyard)?.damage).toBe(1);
  });
});
