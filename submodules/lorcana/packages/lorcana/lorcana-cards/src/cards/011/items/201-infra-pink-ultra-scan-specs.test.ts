import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { infrapinkUltraScanSpecs } from "./201-infra-pink-ultra-scan-specs";

const evidenceDraw = createMockCharacter({
  id: "infra-pink-ultra-scan-specs-evidence-draw",
  name: "Evidence Draw",
  cost: 1,
});

const evidenceDiscard = createMockCharacter({
  id: "infra-pink-ultra-scan-specs-evidence-discard",
  name: "Evidence Discard",
  cost: 1,
});

const alertTarget = createMockCharacter({
  id: "infra-pink-ultra-scan-specs-alert-target",
  name: "Alert Target",
  cost: 2,
});

describe("Infra-Pink Ultra Scan Specs", () => {
  it("draws a card, then lets you choose and discard a card when you play it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [infrapinkUltraScanSpecs, evidenceDiscard],
      deck: [evidenceDraw],
      inkwell: infrapinkUltraScanSpecs.cost,
    });
    const discardId = testEngine.findCardInstanceId(evidenceDiscard, "hand", "p1");

    expect(testEngine.asPlayerOne().playCard(infrapinkUltraScanSpecs)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(infrapinkUltraScanSpecs),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(evidenceDraw)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(evidenceDiscard)).toBe("discard");
  });

  it("banishes itself to give the chosen character Alert this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [infrapinkUltraScanSpecs, alertTarget],
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(infrapinkUltraScanSpecs, {
        targets: [alertTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(infrapinkUltraScanSpecs)).toBe("discard");
    expect(testEngine.asPlayerOne().hasKeyword(alertTarget, "Alert")).toBe(true);
  });

  it("Alert only lasts this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [infrapinkUltraScanSpecs, alertTarget],
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(infrapinkUltraScanSpecs, {
        targets: [alertTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(alertTarget, "Alert")).toBe(false);
  });
});
