// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { helgaSinclairVengefulPartner } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Helga Sinclair - Vengeful Partner", () => {
//   It.skip("**NOTHING PERSONAL** When this character is challenged and banished, banish the challenging character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: helgaSinclairVengefulPartner.cost,
//       Play: [helgaSinclairVengefulPartner],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       HelgaSinclairVengefulPartner.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
