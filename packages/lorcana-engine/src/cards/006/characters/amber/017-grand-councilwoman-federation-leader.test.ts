/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { grandCouncilwomanFederationLeader } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Grand Councilwoman - Federation Leader", () => {
  it.skip("FIND IT! Whenever this character quests, your other Alien characters get +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: grandCouncilwomanFederationLeader.cost,
      play: [grandCouncilwomanFederationLeader],
      hand: [grandCouncilwomanFederationLeader],
    });

    await testEngine.playCard(grandCouncilwomanFederationLeader);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
