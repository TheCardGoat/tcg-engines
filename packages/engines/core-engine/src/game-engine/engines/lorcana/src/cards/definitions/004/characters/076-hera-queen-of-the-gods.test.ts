import { describe, expect, it } from "bun:test";
import { zeusGodOfLightning } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  heraQueenOfTheGods,
  herculesBelovedHero,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hera - Queen of the Gods", () => {
  it("**Ward** _(Opponents can't choose this character except to challenge.)_**PROTECTIVE GODDESS** Your characters named Zeus gain **Ward**.**YOU'RE A TRUE HERO** Your characters named Hercules gain **Evasive**. _(Only characters with Evasive can challenge them.)_", () => {
    const testStore = new TestStore({
      play: [heraQueenOfTheGods, zeusGodOfLightning, herculesBelovedHero],
    });

    const cardUnderTest = testStore.getCard(heraQueenOfTheGods);
    const zeusCard = testStore.getCard(zeusGodOfLightning);
    const herculesCard = testStore.getCard(herculesBelovedHero);

    expect(cardUnderTest.hasWard()).toBe(true);
    expect(zeusCard.hasWard()).toBe(true);
    expect(herculesCard.hasEvasive).toBe(true);
  });
});
