// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { benjaGuardianOfTheDragonGem } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { iveGotADream } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { prideLandsJungleOasis } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("I've Got a Dream", () => {
//   it("Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: prideLandsJungleOasis.moveCost,
//       hand: [iveGotADream],
//       play: [prideLandsJungleOasis, benjaGuardianOfTheDragonGem],
//     });
//
//     await testEngine.moveToLocation({
//       location: prideLandsJungleOasis,
//       character: benjaGuardianOfTheDragonGem,
//     });
//
//     const { singer } = await testEngine.singSong({
//       song: iveGotADream,
//       singer: benjaGuardianOfTheDragonGem,
//     });
//
//     expect(singer.exerted).toBe(true);
//
//     await testEngine.resolveTopOfStack({ targets: [singer] });
//     expect(singer.exerted).toBe(false);
//     expect(singer.hasQuestRestriction).toBe(true);
//     expect(testEngine.getPlayerLore()).toBe(prideLandsJungleOasis.lore);
//   });
// });
//
