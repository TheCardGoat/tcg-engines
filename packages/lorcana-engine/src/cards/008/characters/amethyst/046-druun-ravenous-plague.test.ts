/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { druunRavenousPlague } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Druun - Ravenous Plague", () => {
  it("Challenger +4 (While challenging, this character gets +4 {S}.)", async () => {
    const testEngine = new TestEngine({
      play: [druunRavenousPlague],
    });

    const cardUnderTest = testEngine.getCardModel(druunRavenousPlague);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
