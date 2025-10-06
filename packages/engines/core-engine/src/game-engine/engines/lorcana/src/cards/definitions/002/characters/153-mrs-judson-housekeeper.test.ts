/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { liloGalacticHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  herculesDivineHero,
  mrsJudsonHousekeeper,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

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
