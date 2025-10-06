/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { grandCouncilwomanFederationLeader } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
