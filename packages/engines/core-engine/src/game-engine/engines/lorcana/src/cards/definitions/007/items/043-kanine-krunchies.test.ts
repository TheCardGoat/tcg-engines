/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  kanineKrunchies,
  kashekimAncientRuler,
  luckyRuntOfTheLitter,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

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
