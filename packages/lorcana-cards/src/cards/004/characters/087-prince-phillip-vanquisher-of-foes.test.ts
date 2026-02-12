// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { princePhillipVanquisherOfFoes } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prince Phillip - Vanquisher of Foes", () => {
//   It.skip("**Shift** 6 _You may pay 6 {I} to play this on top of one of your characters named Prince Phillip.)_**Evasive** _(Only characters with Evasive can challenge this character.)_**STRIKE TO THE HEART** When you play this character, banish all opposing characters with at least 1 damage counter.", () => {
//     Const testStore = new TestStore({
//       Play: [princePhillipVanquisherOfFoes],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PrincePhillipVanquisherOfFoes.id,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
