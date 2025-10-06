/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { hiramFlavershamToymaker } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { goofySuperGoof } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { hiddenCoveTranquilHaven } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/locations";

describe("Goofy - Super Goof", () => {
  it("**Rush** _(This character can challenge the turn they're played)_", () => {
    const testStore = new TestStore({
      play: [goofySuperGoof],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", goofySuperGoof.id);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  describe("**SUPER PEANUT POWERS** Whenever this character challenges another, gain 2 lore", () => {
    it("should gain lore when challenging another character", async () => {
      const testEngine = new TestEngine(
        {
          play: [goofySuperGoof],
        },
        {
          play: [hiramFlavershamToymaker],
        },
      );

      await testEngine.tapCard(hiramFlavershamToymaker);
      await testEngine.challenge({
        attacker: goofySuperGoof,
        defender: hiramFlavershamToymaker,
      });

      expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
    });

    it("should NOT gain lore when challenging a location", async () => {
      const testEngine = new TestEngine(
        {
          play: [goofySuperGoof],
        },
        {
          play: [hiddenCoveTranquilHaven],
        },
      );

      await testEngine.challenge({
        attacker: goofySuperGoof,
        defender: hiddenCoveTranquilHaven,
      });

      expect(testEngine.getLoreForPlayer("player_one")).toBe(0);
    });
  });
});
