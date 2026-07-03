import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { celiaMaeFriendlyReceptionist } from "./006-celia-mae-friendly-receptionist";

const exertedAlly = createMockCharacter({
  id: "celia-friendly-receptionist-exerted-ally",
  name: "Exerted Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Celia Mae - Friendly Receptionist", () => {
  it("may pay 1 ink to ready one of your characters and restrict them this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [celiaMaeFriendlyReceptionist],
      inkwell: celiaMaeFriendlyReceptionist.cost + 1,
      play: [{ card: exertedAlly, exerted: true }],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(celiaMaeFriendlyReceptionist)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(celiaMaeFriendlyReceptionist, {
        resolveOptional: true,
        targets: [exertedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(false);
    expect(testEngine.hasRestriction(exertedAlly, "cant-quest-or-challenge")).toBe(true);
  });
});
