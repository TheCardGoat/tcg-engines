/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  shenziHyenaPackLeader,
  ursulaDeceiver,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { nottinghamPrinceJohnsCastle } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/indext";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Shenzi - Hyena Pack Leader", () => {
  it("**I WILL DO IT** When this character is at a location, she gets +3 {S}.", async () => {
    const testEngine = new TestEngine({
      inkwell: nottinghamPrinceJohnsCastle.moveCost,
      play: [shenziHyenaPackLeader, nottinghamPrinceJohnsCastle],
    });

    const cardUnderTest = testEngine.getCardModel(shenziHyenaPackLeader);

    expect(cardUnderTest.strength).toBe(shenziHyenaPackLeader.strength);

    await testEngine.moveToLocation({
      character: shenziHyenaPackLeader,
      location: nottinghamPrinceJohnsCastle,
    });

    expect(cardUnderTest.strength).toBe(shenziHyenaPackLeader.strength + 3);
  });

  it("**WHAT’S THE HURRY?** When this character is at a location, when she challenges another character, you may draw a card.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: nottinghamPrinceJohnsCastle.moveCost,
        play: [shenziHyenaPackLeader, nottinghamPrinceJohnsCastle],
        deck: 3,
      },
      {
        play: [ursulaDeceiver],
      },
    );

    await testEngine.tapCard(ursulaDeceiver);
    await testEngine.moveToLocation({
      character: shenziHyenaPackLeader,
      location: nottinghamPrinceJohnsCastle,
    });

    await testEngine.challenge({
      attacker: shenziHyenaPackLeader,
      defender: ursulaDeceiver,
    });

    await testEngine.resolveOptionalAbility();

    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 2,
        hand: 1,
      }),
    );
  });
});
