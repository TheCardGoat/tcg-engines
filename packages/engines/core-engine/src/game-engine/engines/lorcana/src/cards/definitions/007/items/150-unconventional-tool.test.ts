/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { hiramFlavershamToymaker } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  baymaxsChargingStation,
  unconventionalTool,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Unconventional Tool", () => {
  it("FIXED IN NO TIME When this item is banished, you pay 2 {I} less for the next item you play this turn.", async () => {
    const testEngine = new TestEngine({
      deck: 4,
      play: [unconventionalTool, hiramFlavershamToymaker],
      hand: [baymaxsChargingStation],
    });

    const target = testEngine.getCardModel(baymaxsChargingStation);
    expect(target.cost).toBe(baymaxsChargingStation.cost);

    await testEngine.questCard(hiramFlavershamToymaker);
    await testEngine.acceptOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [unconventionalTool] });

    expect(target.cost).toBe(baymaxsChargingStation.cost - 2);
  });
});
