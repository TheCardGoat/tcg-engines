/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { pinocchioOnTheRun } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { magicalAid } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("Magical Aid", () => {
  it("Chosen character gains **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn. _(They get +3 {S} while challenging.)_", () => {
    const testStore = new TestStore(
      {
        inkwell: magicalAid.cost,
        hand: [magicalAid],
        play: [liloMakingAWish],
      },
      {
        play: [pinocchioOnTheRun],
      },
    );

    const cardUnderTest = testStore.getCard(magicalAid);
    const challenger = testStore.getCard(liloMakingAWish);
    const defender = testStore.getCard(pinocchioOnTheRun);

    defender.updateCardMeta({ exerted: true });

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [challenger] });
    expect(challenger.hasChallenger).toEqual(true);

    challenger.challenge(defender);
    expect(challenger.zone).toEqual("hand");
  });
});
