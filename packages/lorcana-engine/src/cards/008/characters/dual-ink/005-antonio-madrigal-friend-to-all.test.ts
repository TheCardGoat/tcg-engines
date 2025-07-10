/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { thisIsMyFamily } from "@lorcanito/lorcana-engine/cards/007";
import {
  antonioMadrigalFriendToAll,
  deweyLovableShowoff,
  goofyGroundbreakingChef,
  hueyReliableLeader,
  louieOneCoolDuck,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Antonio Madrigal - Friend to All", () => {
  it("OF COURSE THEY CAN COME Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.", async () => {
    const testEngine = new TestEngine({
      play: [antonioMadrigalFriendToAll],
      hand: [thisIsMyFamily],
      deck: [
        louieOneCoolDuck,
        deweyLovableShowoff,
        hueyReliableLeader,
        goofyGroundbreakingChef,
      ],
    });

    const cardTest = testEngine.getCardModel(antonioMadrigalFriendToAll);

    await testEngine.singSong({
      singer: cardTest,
      song: testEngine.getCardModel(thisIsMyFamily),
    });

    await testEngine.resolveOptionalAbility();

    await testEngine.resolveTopOfStack({ targets: [louieOneCoolDuck] });

    expect(testEngine.getCardModel(louieOneCoolDuck).zone).toEqual("hand");

    expect(testEngine.getCardModel(louieOneCoolDuck).isRevealed).toEqual(true);
  });
});
