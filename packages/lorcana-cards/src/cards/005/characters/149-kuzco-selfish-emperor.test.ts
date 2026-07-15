// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import {
//   KuzcoSelfishEmperor,
//   MonstroWhaleOfAWhale,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Kuzco - Selfish Emperor", () => {
//   It("**OUTPLACEMENT** When you play this character, you may put chosen item or location into its player’s inkwell facedown and exerted.<br/>**BY INVITE ONLY** 4 {I} − Your other characters gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: kuzcoSelfishEmperor.cost,
//         Hand: [kuzcoSelfishEmperor],
//       },
//       {
//         Play: [pawpsicle],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(kuzcoSelfishEmperor);
//     Const target = testStore.getCard(pawpsicle);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(testStore.getZonesCardCount("player_two").inkwell).toEqual(1);
//   });
//   It("**OUTPLACEMENT** Opt out", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: kuzcoSelfishEmperor.cost,
//         Hand: [kuzcoSelfishEmperor],
//       },
//       {
//         Play: [pawpsicle],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(kuzcoSelfishEmperor);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     Expect(cardUnderTest.zone).toEqual("play");
//     Expect(testStore.getZonesCardCount("player_two").inkwell).toEqual(0);
//   });
//   It("**BY INVITE ONLY** 4 {I} − Your other characters gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: kuzcoSelfishEmperor.cost,
//       Play: [kuzcoSelfishEmperor, monstroWhaleOfAWhale],
//     });
//
//     Const cardUnderTest = testStore.getCard(kuzcoSelfishEmperor);
//     Const monstro = testStore.getCard(monstroWhaleOfAWhale);
//
//     Expect(monstro.hasResist).toEqual(false);
//     CardUnderTest.activate();
//     Expect(monstro.hasResist).toEqual(true);
//     Expect(cardUnderTest.hasResist).toEqual(false);
//   });
// });
//
