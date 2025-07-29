import { describe, expect, it } from "bun:test";
import { oneLastHope } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import {
  faZhouMulansFather,
  flynnRiderFrenemy,
  goofySuperGoof,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("One Last Hope", () => {
  it("Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: oneLastHope.cost,
      hand: [oneLastHope],
      play: [goofySuperGoof],
    });

    const target = testEngine.getCardModel(goofySuperGoof);

    expect(target.hasResist).toBe(false);
    expect(target.canChallengeReadyCharacters).toBe(false);

    await testEngine.playCard(oneLastHope, { targets: [goofySuperGoof] });

    expect(target.hasResist).toBe(true);
    expect(target.canChallengeReadyCharacters).toBe(true);
  });

  it("Chosen character gains **Resist** +2 until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: oneLastHope.cost,
      hand: [oneLastHope],
      play: [faZhouMulansFather],
    });

    const target = testEngine.getCardModel(faZhouMulansFather);

    expect(target.hasResist).toBe(false);
    expect(target.canChallengeReadyCharacters).toBe(false);

    await testEngine.playCard(oneLastHope, { targets: [target] });

    expect(target.hasResist).toBe(true);
    expect(target.canChallengeReadyCharacters).toBe(false);
  });
});
