// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MonstroWhaleOfAWhale,
//   ScroopOdiousMutineer,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Scroop - Odious Mutineer", () => {
//   It("**DO SAY HELLO TO MR. ARROW** When you play this character, you may pay 3 {I} to banish chosen damaged character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: scroopOdiousMutineer.cost + 3,
//       Hand: [scroopOdiousMutineer],
//       Play: [monstroWhaleOfAWhale],
//     });
//
//     Const cardUnderTest = testStore.getCard(scroopOdiousMutineer);
//     Const target = testStore.getCard(monstroWhaleOfAWhale);
//     Target.updateCardMeta({ damage: 2 });
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("discard");
//   });
// });
//
