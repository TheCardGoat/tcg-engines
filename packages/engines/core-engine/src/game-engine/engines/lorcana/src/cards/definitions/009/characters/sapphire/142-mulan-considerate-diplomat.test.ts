/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { heiheiBoatSnack } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/007-heihei-boat-snack";
import { shieldOfVirtue } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/135-shield-of-virtue";
import { hiramFlavershamToymaker } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/149-hiram-flaversham-toymaker";
import { tipoGrowingSon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/157-tipo-growing-son";
import {
  charlotteLaBouffMardiGrasPrincess,
  deweyLovableShowoff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { mulanConsiderateDiplomat } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mulan - Considerate Diplomat", () => {
  it("IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      play: [mulanConsiderateDiplomat],
      deck: [
        shieldOfVirtue,
        heiheiBoatSnack,
        deweyLovableShowoff,
        charlotteLaBouffMardiGrasPrincess,
        tipoGrowingSon,
        hiramFlavershamToymaker,
      ],
    });

    const cardUnderTest = testEngine.getCardModel(mulanConsiderateDiplomat);
    const princess = testEngine.getCardModel(charlotteLaBouffMardiGrasPrincess);

    await testEngine.questCard(cardUnderTest);

    await testEngine.resolveTopOfStack({
      scry: {
        bottom: [hiramFlavershamToymaker, tipoGrowingSon, deweyLovableShowoff],
        hand: [charlotteLaBouffMardiGrasPrincess],
      },
    });

    expect(testEngine.getCardZone(princess)).toEqual("hand");

    const bottomCard = testEngine.testStore.getZonesCards().deck[0];
    const secondBottomCard = testEngine.testStore.getZonesCards().deck[1];
    const thirdBottomCard = testEngine.testStore.getZonesCards().deck[2];

    expect(bottomCard?.lorcanitoCard?.name).toEqual(
      hiramFlavershamToymaker.name,
    );
    expect(secondBottomCard?.lorcanitoCard?.name).toEqual(tipoGrowingSon.name);
    expect(thirdBottomCard?.lorcanitoCard?.name).toEqual(
      deweyLovableShowoff.name,
    );
  });
});
