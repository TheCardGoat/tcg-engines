import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { chienpoImperialSoldier } from "./178-chien-po-imperial-soldier";

describe("Chien-Po - Imperial Soldier", () => {
  it("can enter play exerted because it has Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [chienpoImperialSoldier],
      inkwell: chienpoImperialSoldier.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(chienpoImperialSoldier, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(chienpoImperialSoldier)?.exerted).toBe(true);
  });
});
