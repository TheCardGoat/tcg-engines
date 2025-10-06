/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { hiroHamadaRoboticsProdigy } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import {
  hiroHamadaArmorDesigner,
  hiroHamadaFutureChampion,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Hiro Hamada - Future Champion", () => {
  it("ORIGIN STORY When you play a Floodborn character on this card, draw a card.", async () => {
    const testEngine = new TestEngine({
      deck: 3,
      inkwell: hiroHamadaArmorDesigner.cost,
      play: [hiroHamadaFutureChampion],
      hand: [hiroHamadaArmorDesigner],
    });

    await testEngine.shiftCard({
      shifted: hiroHamadaFutureChampion,
      shifter: hiroHamadaArmorDesigner,
    });

    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 2,
      }),
    );
  });
});

describe("Regression", () => {
  it("should not trigger when Hiro is not the target", async () => {
    const testEngine = new TestEngine({
      deck: 3,
      inkwell: hiroHamadaArmorDesigner.cost,
      play: [hiroHamadaFutureChampion, hiroHamadaRoboticsProdigy],
      hand: [hiroHamadaArmorDesigner],
    });

    await testEngine.shiftCard({
      shifted: hiroHamadaRoboticsProdigy,
      shifter: hiroHamadaArmorDesigner,
    });

    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 0,
        deck: 3,
      }),
    );
  });
});
