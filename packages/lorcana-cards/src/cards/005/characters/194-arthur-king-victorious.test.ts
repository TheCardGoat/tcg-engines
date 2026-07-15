// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArthurKingVictorious,
//   MufasaRulerOfPrideRock,
//   PrinceNaveenUkulelePlayer,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Arthur - King Victorious", () => {
//   It("**KNIGHTED BY THE KING** When you play this character, chosen character gains **Challenger** +2 and **Resist** +2 and can challenge ready characters this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: arthurKingVictorious.cost,
//         Hand: [arthurKingVictorious],
//         Play: [princeNaveenUkulelePlayer],
//       },
//       {
//         Play: [mufasaRulerOfPrideRock],
//         Deck: 1,
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(arthurKingVictorious);
//     Const target = testStore.getCard(princeNaveenUkulelePlayer);
//     Const defender = testStore.getCard(mufasaRulerOfPrideRock);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasChallenger).toEqual(true);
//     Expect(target.hasResist).toEqual(true);
//     Expect(target.canChallenge(defender)).toEqual(true);
//
//     TestStore.passTurn();
//
//     Expect(target.hasChallenger).toEqual(false);
//     Expect(target.hasResist).toEqual(false);
//     Expect(target.canChallenge(defender)).toEqual(false);
//   });
// });
//
