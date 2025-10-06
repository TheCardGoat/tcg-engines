/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { merlinCleverClairvoyant } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Merlin - Clever Clairvoyant", () => {
  it.skip("PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.", async () => {
    const testEngine = new TestEngine({
      inkwell: merlinCleverClairvoyant.cost,
      play: [merlinCleverClairvoyant],
      hand: [merlinCleverClairvoyant],
    });

    await testEngine.playCard(merlinCleverClairvoyant);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
