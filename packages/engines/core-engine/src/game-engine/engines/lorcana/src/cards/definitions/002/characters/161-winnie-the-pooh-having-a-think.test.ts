/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  theNokkWaterSpirit,
  winnieThePoohHavingAThink,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Winnie the Pooh - Having a Think", () => {
  it("**HUNNY POT** Whenever this character quests, you may put a card from your hand into your inkwell facedown.", () => {
    const testStore = new TestStore({
      play: [winnieThePoohHavingAThink],
      hand: [theNokkWaterSpirit],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      winnieThePoohHavingAThink.id,
    );
    const target = testStore.getByZoneAndId("hand", theNokkWaterSpirit.id);

    cardUnderTest.quest();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("inkwell");
  });
});
