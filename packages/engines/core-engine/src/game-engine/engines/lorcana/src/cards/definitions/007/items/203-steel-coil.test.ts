import { describe, expect, it } from "bun:test";
import {
  kashekimAncientRuler,
  kodaSmallishBear,
  steelCoil,
  suzyMasterSeamstress,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Steel Coil", () => {
  it("METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.", async () => {
    const testEngine = new TestEngine({
      deck: [kodaSmallishBear],
      play: [steelCoil],
      hand: [suzyMasterSeamstress, kashekimAncientRuler],
    });

    await testEngine.putIntoInkwell(suzyMasterSeamstress);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });

    expect(testEngine.getCardModel(suzyMasterSeamstress).zone).toBe("inkwell");
    expect(testEngine.getCardModel(kashekimAncientRuler).zone).toBe("discard");
    expect(testEngine.getCardModel(kodaSmallishBear).zone).toBe("hand");
  });
});

describe("Regression", () => {
  it("should be able to discard the card that was drawn", async () => {
    const testEngine = new TestEngine({
      deck: [kodaSmallishBear],
      play: [steelCoil],
      hand: [suzyMasterSeamstress, kashekimAncientRuler],
    });

    await testEngine.putIntoInkwell(suzyMasterSeamstress);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [kodaSmallishBear] });

    expect(testEngine.getCardModel(suzyMasterSeamstress).zone).toBe("inkwell");
    expect(testEngine.getCardModel(kashekimAncientRuler).zone).toBe("hand");
    expect(testEngine.getCardModel(kodaSmallishBear).zone).toBe("discard");
  });
});
