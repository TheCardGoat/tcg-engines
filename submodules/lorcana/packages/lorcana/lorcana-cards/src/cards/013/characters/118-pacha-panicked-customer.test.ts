import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { pachaPanickedCustomer } from "./118-pacha-panicked-customer";

describe("Pacha - Panicked Customer", () => {
  it("has Reckless", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pachaPanickedCustomer],
    });

    expect(testEngine.asPlayerOne().hasKeyword(pachaPanickedCustomer, "Reckless")).toBe(true);
  });

  it("gets +4 strength during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pachaPanickedCustomer],
    });

    expect(testEngine.getCard(pachaPanickedCustomer).strength).toBe(
      pachaPanickedCustomer.strength + 4,
    );
  });
});
