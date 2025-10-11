import { describe, expect, it } from "bun:test";
import { mickeyMouseArtfulRogue } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { jollyRogerHooksShip } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jolly Roger - Hook's Ship", () => {
  it("should grant Rush to characters", async () => {
    const testEngine = new TestEngine({
      inkwell: jollyRogerHooksShip.moveCost * 2,
      play: [jollyRogerHooksShip, mrSmeeBumblingMate, mickeyMouseArtfulRogue],
    });

    const { location: jolly, character: mrSmee } =
      await testEngine.moveToLocation({
        location: jollyRogerHooksShip,
        character: mrSmeeBumblingMate,
      });

    // Move Mickey Mouse (Artful Rogue) to the location and check for Rush
    const { character: mickey } = await testEngine.moveToLocation({
      location: jollyRogerHooksShip,
      character: mickeyMouseArtfulRogue,
    });

    // Check for Rush ability using the hasRush property
    expect(mickey.isAtLocation(jolly)).toBe(true);
    expect(mickey.hasRush).toBe(true);

    expect(mrSmee.isAtLocation(jolly)).toBe(true);

    // Ensure no additional stack layers are present
    expect(testEngine.stackLayers).toHaveLength(0);
  });

  it("should allow Pirate characters to move for free", async () => {
    const testEngine = new TestEngine({
      inkwell: 0,
      play: [jollyRogerHooksShip, mrSmeeBumblingMate, mickeyMouseArtfulRogue],
    });

    // Move Mr. Smee (a Pirate) to the location and check for free movement
    const { location: jolly, character: mrSmee } =
      await testEngine.moveToLocation({
        location: jollyRogerHooksShip,
        character: mrSmeeBumblingMate,
      });

    expect(jolly.containsCharacter(mrSmee)).toBe(true);

    // Try to move Mickey Mouse (Artful Rogue) to the location, it should fail as we don't have enough ink
    const { character: mickey } = await testEngine.moveToLocation({
      location: jollyRogerHooksShip,
      character: mickeyMouseArtfulRogue,
      skipAssertion: true,
    });

    expect(jolly.containsCharacter(mickey)).toBe(false);

    // Ensure no additional stack layers are present
    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
