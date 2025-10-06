/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { druunRavenousPlague } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Druun - Ravenous Plague", () => {
  it("Challenger +4 (While challenging, this character gets +4 {S}.)", async () => {
    const testEngine = new TestEngine({
      play: [druunRavenousPlague],
    });

    const cardUnderTest = testEngine.getCardModel(druunRavenousPlague);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
