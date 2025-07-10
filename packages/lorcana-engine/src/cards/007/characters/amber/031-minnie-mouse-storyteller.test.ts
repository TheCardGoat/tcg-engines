/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloMakingAWish,
  mauiHeroToAll,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { chernabogsFollowersCreaturesOfEvil } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { daisyDuckDonaldsDate } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { minnieMouseStoryteller } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Minnie Mouse - Storyteller", () => {
  it("GATHER AROUND Whenever you play a character, this character gets +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell:
        daisyDuckDonaldsDate.cost +
        chernabogsFollowersCreaturesOfEvil.cost +
        pawpsicle.cost,
      play: [minnieMouseStoryteller],
      hand: [
        daisyDuckDonaldsDate,
        chernabogsFollowersCreaturesOfEvil,
        pawpsicle,
      ],
    });

    const minnie = testEngine.getCardModel(minnieMouseStoryteller);

    await testEngine.playCard(daisyDuckDonaldsDate);
    expect(minnie.lore).toBe(1);
    await testEngine.playCard(chernabogsFollowersCreaturesOfEvil);
    expect(minnie.lore).toBe(2);
    await testEngine.playCard(pawpsicle);
    expect(minnie.lore).toBe(2);
  });

  it("JUST ONE MORE Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell:
          daisyDuckDonaldsDate.cost +
          chernabogsFollowersCreaturesOfEvil.cost +
          liloMakingAWish.cost,
        play: [minnieMouseStoryteller],
        hand: [
          daisyDuckDonaldsDate,
          chernabogsFollowersCreaturesOfEvil,
          liloMakingAWish,
        ],
      },
      { play: [mauiHeroToAll] },
    );

    const minnie = testEngine.getCardModel(minnieMouseStoryteller);
    const maui = testEngine.getCardModel(mauiHeroToAll);

    await testEngine.playCard(daisyDuckDonaldsDate);
    await testEngine.playCard(chernabogsFollowersCreaturesOfEvil);
    await testEngine.playCard(liloMakingAWish);

    minnie.quest();

    expect(maui.strength).toBe(mauiHeroToAll.strength);
    await testEngine.resolveTopOfStack({ targets: [maui] });
    expect(maui.strength).toBe(mauiHeroToAll.strength - 3);

    await testEngine.passTurn();

    expect(maui.strength).toBe(mauiHeroToAll.strength - 3);
  });
});
