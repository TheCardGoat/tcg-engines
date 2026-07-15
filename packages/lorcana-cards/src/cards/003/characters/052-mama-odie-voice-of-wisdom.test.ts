// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mamaOdieVoiceOfWisdom } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mama Odie - Voice of Wisdom", () => {
//   It.skip("**LISTEN TO YOUR MAMA NOW** Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mamaOdieVoiceOfWisdom.cost,
//       Play: [mamaOdieVoiceOfWisdom],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MamaOdieVoiceOfWisdom.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
