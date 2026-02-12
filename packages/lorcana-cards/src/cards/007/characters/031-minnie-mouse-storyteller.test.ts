// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   MauiHeroToAll,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { chernabogsFollowersCreaturesOfEvil } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { daisyDuckDonaldsDate } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { minnieMouseStoryteller } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Minnie Mouse - Storyteller", () => {
//   It("GATHER AROUND Whenever you play a character, this character gets +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell:
//         DaisyDuckDonaldsDate.cost +
//         ChernabogsFollowersCreaturesOfEvil.cost +
//         Pawpsicle.cost,
//       Play: [minnieMouseStoryteller],
//       Hand: [
//         DaisyDuckDonaldsDate,
//         ChernabogsFollowersCreaturesOfEvil,
//         Pawpsicle,
//       ],
//     });
//
//     Const minnie = testEngine.getCardModel(minnieMouseStoryteller);
//
//     Await testEngine.playCard(daisyDuckDonaldsDate);
//     Expect(minnie.lore).toBe(1);
//     Await testEngine.playCard(chernabogsFollowersCreaturesOfEvil);
//     Expect(minnie.lore).toBe(2);
//     Await testEngine.playCard(pawpsicle);
//     Expect(minnie.lore).toBe(2);
//   });
//
//   It("JUST ONE MORE Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell:
//           DaisyDuckDonaldsDate.cost +
//           ChernabogsFollowersCreaturesOfEvil.cost +
//           LiloMakingAWish.cost,
//         Play: [minnieMouseStoryteller],
//         Hand: [
//           DaisyDuckDonaldsDate,
//           ChernabogsFollowersCreaturesOfEvil,
//           LiloMakingAWish,
//         ],
//       },
//       { play: [mauiHeroToAll] },
//     );
//
//     Const minnie = testEngine.getCardModel(minnieMouseStoryteller);
//     Const maui = testEngine.getCardModel(mauiHeroToAll);
//
//     Await testEngine.playCard(daisyDuckDonaldsDate);
//     Await testEngine.playCard(chernabogsFollowersCreaturesOfEvil);
//     Await testEngine.playCard(liloMakingAWish);
//
//     Minnie.quest();
//
//     Expect(maui.strength).toBe(mauiHeroToAll.strength);
//     Await testEngine.resolveTopOfStack({ targets: [maui] });
//     Expect(maui.strength).toBe(mauiHeroToAll.strength - 3);
//
//     Await testEngine.passTurn();
//
//     Expect(maui.strength).toBe(mauiHeroToAll.strength - 3);
//   });
// });
//
