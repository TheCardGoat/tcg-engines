/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  donKarnageAirPirateLeader,
  dumptruckKarnagesSecondMate,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Dumptruck - Karnage's Second Mate", () => {
  it("LET ME AT 'EM When you play this character, you may deal 1 damage to chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: dumptruckKarnagesSecondMate.cost,
      hand: [dumptruckKarnagesSecondMate],
      play: [donKarnageAirPirateLeader],
    });

    await testEngine.playCard(dumptruckKarnagesSecondMate);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({
      targets: [donKarnageAirPirateLeader],
    });
    expect(testEngine.getCardModel(donKarnageAirPirateLeader).damage).toEqual(
      1,
    );
  });
});
