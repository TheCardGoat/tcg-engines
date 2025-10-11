import { describe, expect, it } from "bun:test";
import { baymaxLowBattery } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("SHHHHH This character enters play exerted.", () => {
  it("should enter exerted", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [],
      hand: [baymaxLowBattery],
    });

    await testEngine.playCard(baymaxLowBattery);

    expect(testEngine.getCardModel(baymaxLowBattery).meta.exerted).toBeTruthy();
  });
});
