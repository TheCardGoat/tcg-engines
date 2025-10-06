/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hiramFlavershamToymaker } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { missBiancaInternationalRescueAidSocietyAgent } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { andThenAlongCameZeus } from "../actions";

describe("Miss Bianca - International Rescue Aid Society Agent", () => {
  it("**Singer** 4 _(This character counts as cost 4 to sing songs.)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 2,
        hand: [andThenAlongCameZeus],
        play: [missBiancaInternationalRescueAidSocietyAgent],
      },
      {
        play: [hiramFlavershamToymaker],
      },
    );

    const cardUnderTest = testEngine.getCardModel(
      missBiancaInternationalRescueAidSocietyAgent,
    );
    const song = testEngine.getCardModel(andThenAlongCameZeus);
    const target = testEngine.getCardModel(hiramFlavershamToymaker);

    expect(cardUnderTest.hasSinger).toBe(true);

    cardUnderTest.sing(song);
    await testEngine.resolveTopOfStack({ targets: [target] }, true);

    expect(testEngine.getCardZone(song)).toBe("discard");
    expect(target.damage).toBe(5);
  });
});
