// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { benjaGuardianOfTheDragonGem } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { iveGotADream } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { prideLandsJungleOasis } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("I've Got a Dream", () => {
//   It("Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: prideLandsJungleOasis.moveCost,
//       Hand: [iveGotADream],
//       Play: [prideLandsJungleOasis, benjaGuardianOfTheDragonGem],
//     });
//
//     Await testEngine.moveToLocation({
//       Location: prideLandsJungleOasis,
//       Character: benjaGuardianOfTheDragonGem,
//     });
//
//     Const { singer } = await testEngine.singSong({
//       Song: iveGotADream,
//       Singer: benjaGuardianOfTheDragonGem,
//     });
//
//     Expect(singer.exerted).toBe(true);
//
//     Await testEngine.resolveTopOfStack({ targets: [singer] });
//     Expect(singer.exerted).toBe(false);
//     Expect(singer.hasQuestRestriction).toBe(true);
//     Expect(testEngine.getPlayerLore()).toBe(prideLandsJungleOasis.lore);
//   });
// });
//
