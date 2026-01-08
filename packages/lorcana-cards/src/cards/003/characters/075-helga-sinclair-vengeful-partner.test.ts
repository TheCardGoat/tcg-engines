// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { helgaSinclairVengefulPartner } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Helga Sinclair - Vengeful Partner", () => {
//   it.skip("**NOTHING PERSONAL** When this character is challenged and banished, banish the challenging character.", () => {
//     const testStore = new TestStore({
//       inkwell: helgaSinclairVengefulPartner.cost,
//       play: [helgaSinclairVengefulPartner],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       helgaSinclairVengefulPartner.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
