// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   monstroWhaleOfAWhale,
//   scroopOdiousMutineer,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Scroop - Odious Mutineer", () => {
//   it("**DO SAY HELLO TO MR. ARROW** When you play this character, you may pay 3 {I} to banish chosen damaged character.", () => {
//     const testStore = new TestStore({
//       inkwell: scroopOdiousMutineer.cost + 3,
//       hand: [scroopOdiousMutineer],
//       play: [monstroWhaleOfAWhale],
//     });
//
//     const cardUnderTest = testStore.getCard(scroopOdiousMutineer);
//     const target = testStore.getCard(monstroWhaleOfAWhale);
//     target.updateCardMeta({ damage: 2 });
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toBe("discard");
//   });
// });
//
