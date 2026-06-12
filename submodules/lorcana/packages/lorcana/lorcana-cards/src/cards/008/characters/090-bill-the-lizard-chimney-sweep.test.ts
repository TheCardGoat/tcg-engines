import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { billTheLizardChimneySweep } from "./090-bill-the-lizard-chimney-sweep";

const healthyCharacter = createMockCharacter({
  id: "bill-healthy-character",
  name: "Healthy Character",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Bill the Lizard - Chimney Sweep", () => {
  it("gains Evasive only while another damaged character is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: billTheLizardChimneySweep, damage: 1 }, healthyCharacter],
    });

    expect(testEngine.asPlayerOne().getCard(billTheLizardChimneySweep).hasEvasive).toBe(false);

    expect(testEngine.asServer().manualSetDamage(healthyCharacter, 1)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(billTheLizardChimneySweep).hasEvasive).toBe(true);
  });
});
