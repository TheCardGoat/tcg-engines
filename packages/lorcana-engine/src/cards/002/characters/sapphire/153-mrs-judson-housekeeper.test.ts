/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  herculesDivineHero,
  mrsJudsonHousekeeper,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Mrs. Judson - Housekeeper", () => {
  it("**TIDY UP** Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: herculesDivineHero.cost,
      hand: [herculesDivineHero],
      play: [mrsJudsonHousekeeper],
      deck: [liloGalacticHero],
    });

    const floodbornChar = testStore.getByZoneAndId(
      "hand",
      herculesDivineHero.id,
    );
    const target = testStore.getByZoneAndId("deck", liloGalacticHero.id);

    floodbornChar.playFromHand();
    testStore.resolveOptionalAbility();

    expect(target.zone).toEqual("inkwell");
    expect(target.ready).toEqual(false);
  });
});
