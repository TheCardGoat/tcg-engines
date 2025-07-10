/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  kanineKrunchies,
  kashekimAncientRuler,
  luckyRuntOfTheLitter,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Kanine Krunchies", () => {
  it("YOU CAN BE A CHAMPION, TOO Your Puppy characters get +1 {W}.", async () => {
    const testEngine = new TestEngine({
      play: [kanineKrunchies, kashekimAncientRuler, luckyRuntOfTheLitter],
    });

    expect(testEngine.getCardModel(luckyRuntOfTheLitter).willpower).toBe(
      luckyRuntOfTheLitter.willpower + 1,
    );
    expect(testEngine.getCardModel(kashekimAncientRuler).willpower).toBe(
      luckyRuntOfTheLitter.willpower,
    );
  });
});
