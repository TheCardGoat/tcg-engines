import {
  mutatedMassBlue,
  rockyardRodeoBlue,
  spectralProcessionRed,
  toughAsARokBlue,
} from "@tcg/flesh-and-blood-cards/simulator-scenario-cards";
import { describe, expect, it } from "vitest";

import { getFabEngineScenario } from "./engineScenarios";
import { presentRuntime } from "./projection";

describe("dynamic property values visual scenario", () => {
  it("projects four authored cards with four different live-value causes", () => {
    const match = getFabEngineScenario("dynamic-property-values")?.boot();
    if (!match) throw new Error("Missing dynamic property values scenario.");

    const presentation = presentRuntime(match.runtime, match.player1Id);
    const numericByCardId = Object.fromEntries(
      Object.values(presentation.cards)
        .filter((card) => card.ownerId === match.player1Id && card.zone === "hand")
        .map((card) => [card.cardId, card.currentNumeric]),
    );

    expect(numericByCardId[rockyardRodeoBlue.canonicalId]).toMatchObject({
      power: 7,
      defense: 2,
    });
    expect(numericByCardId[mutatedMassBlue.canonicalId]).toMatchObject({
      power: 6,
      defense: 6,
    });
    expect(numericByCardId[spectralProcessionRed.canonicalId]?.power).toBe(2);
    expect(numericByCardId[toughAsARokBlue.canonicalId]?.power).toBe(6);
  });
});
