import { describe, expect, it } from "bun:test";
import {
  mickeyBraveLittleTailor,
  mickeyMouseTrueFriend,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { madamMimFox } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { hadesDoubleDealer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hades - Double Dealer", () => {
  it("**GET DOWN TO BUSINESS** {E},  Banish chosen character of yours - Play another character from your hand with the same name.", () => {
    const testEngine = new TestEngine({
      play: [hadesDoubleDealer, mickeyBraveLittleTailor],
      hand: [mickeyMouseTrueFriend, madamMimFox],
    });

    testEngine.activateCard(hadesDoubleDealer);
    testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] }, true);
    expect(testEngine.getCardZone(mickeyBraveLittleTailor)).toBe("discard");

    testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] }, true);
    expect(testEngine.getCardZone(mickeyMouseTrueFriend)).toBe("play");
  });
  it("Cannot play a character with a different name", () => {
    const testEngine = new TestEngine({
      play: [hadesDoubleDealer, mickeyBraveLittleTailor],
      hand: [mickeyMouseTrueFriend, madamMimFox],
    });

    testEngine.activateCard(hadesDoubleDealer);
    testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] }, true);
    expect(testEngine.getCardZone(mickeyBraveLittleTailor)).toBe("discard");

    testEngine.resolveTopOfStack({ targets: [madamMimFox] }, true);
    expect(testEngine.getCardZone(madamMimFox)).toBe("hand");
  });
});
