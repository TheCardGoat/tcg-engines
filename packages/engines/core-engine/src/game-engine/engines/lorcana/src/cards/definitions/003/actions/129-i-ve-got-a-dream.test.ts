import { describe, expect, it } from "bun:test";
import { benjaGuardianOfTheDragonGem } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { iveGotADream } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { prideLandsJungleOasis } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/locations";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("I've Got a Dream", () => {
  it("Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.", async () => {
    const testEngine = new TestEngine({
      inkwell: prideLandsJungleOasis.moveCost,
      hand: [iveGotADream],
      play: [prideLandsJungleOasis, benjaGuardianOfTheDragonGem],
    });

    await testEngine.moveToLocation({
      location: prideLandsJungleOasis,
      character: benjaGuardianOfTheDragonGem,
    });

    const { singer } = await testEngine.singSong({
      song: iveGotADream,
      singer: benjaGuardianOfTheDragonGem,
    });

    expect(singer.exerted).toBe(true);

    await testEngine.resolveTopOfStack({ targets: [singer] });
    expect(singer.exerted).toBe(false);
    expect(singer.hasQuestRestriction).toBe(true);
    expect(testEngine.getPlayerLore()).toBe(prideLandsJungleOasis.lore);
  });
});
