// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { adorabeezleWinterpopIceRocketRacer } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Adorabeezle Winterpop - Ice Rocket Racer", () => {
//   It("KEEP DRIVING While this character has damage, she gets +1 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [adorabeezleWinterpopIceRocketRacer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       AdorabeezleWinterpopIceRocketRacer,
//     );
//
//     Expect(cardUnderTest.lore).toEqual(adorabeezleWinterpopIceRocketRacer.lore);
//
//     Await testEngine.setCardDamage(cardUnderTest, 1);
//
//     Expect(cardUnderTest.lore).toEqual(
//       AdorabeezleWinterpopIceRocketRacer.lore + 1,
//     );
//   });
// });
//
