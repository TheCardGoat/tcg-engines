import { describe, expect, it } from "@jest/globals";
import {
  chiefTui,
  moanaOfMotunui,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
/**
 * @jest-environment node
 */
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Support keyword", () => {
  it("**Support** _(Whenever this character quests, you may add their {S} to another chosen character‘s {S} this turn.)", () => {
    const testStore = new TestStore({
      play: [chiefTui, moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", chiefTui.id);
    const supportedChar = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    expect(supportedChar.strength).toEqual(moanaOfMotunui.strength);

    cardUnderTest.quest();

    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targetId: supportedChar.instanceId });

    expect(supportedChar.strength).toEqual(
      (moanaOfMotunui?.strength || 0) + (chiefTui?.strength || 0),
    );
  });
});
