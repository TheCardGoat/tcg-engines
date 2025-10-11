import { describe, it } from "bun:test";
import { magicaDeSpellThievingSorceress } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Magica De Spell - Thieving Sorceress", () => {
  it.skip("**TELEKINESIS** {E} – Return chosen item with cost equal to or less than this character's {S} to its player's hand.", () => {
    const testStore = new TestStore({
      inkwell: magicaDeSpellThievingSorceress.cost,
      play: [magicaDeSpellThievingSorceress],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      magicaDeSpellThievingSorceress.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
