/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { druunRavenousPlague } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Druun - Ravenous Plague", () => {
  it("Challenger +4 (While challenging, this character gets +4 {S}.)", async () => {
    const testEngine = new TestEngine({
      play: [druunRavenousPlague],
    });

    const cardUnderTest = testEngine.getCardModel(druunRavenousPlague);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
