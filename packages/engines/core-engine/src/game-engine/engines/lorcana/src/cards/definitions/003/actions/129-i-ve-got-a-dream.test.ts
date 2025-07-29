/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { benjaGuardianOfTheDragonGem } from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { iveGotADream } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { prideLandsJungleOasis } from "@lorcanito/lorcana-engine/cards/005/locations/locations.ts";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";

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
