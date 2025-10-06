/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { baymaxLowBattery } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

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
