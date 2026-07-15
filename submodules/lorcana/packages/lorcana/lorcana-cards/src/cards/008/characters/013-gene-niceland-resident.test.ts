import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { geneNicelandResident } from "./013-gene-niceland-resident";

const damagedCharacter = createMockCharacter({
  id: "gene-niceland-resident-damaged-character",
  name: "Damaged Character",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Gene - Niceland Resident", () => {
  it("I GUESS YOU EARNED THIS - when this character quests, you may remove up to 2 damage from chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [geneNicelandResident, { card: damagedCharacter, damage: 3 }],
      deck: 2,
    });

    const damagedCharacterId = testEngine.findCardInstanceId(damagedCharacter, "play");

    expect(testEngine.asPlayerOne().quest(geneNicelandResident)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(geneNicelandResident, {
        resolveOptional: true,
        targets: [damagedCharacter],
      }),
    ).toBeSuccessfulCommand();

    const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
    if (pendingChoice) {
      expect(testEngine.asPlayerOne().resolveNextPending({ amount: 2 })).toBeSuccessfulCommand();
    }

    const damagedCharacterModel = testEngine.asServer().getCard(damagedCharacterId);
    expect(damagedCharacterModel.damage).toBe(1);
  });
});
