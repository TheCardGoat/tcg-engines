// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import {
//   liloGalacticHero,
//   liloMakingAWish,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   bePrepared,
//   grabYourSword,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { lyleTiberiusRourkeCunningMercenary } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { liloJuniorCakeDecorator } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Lyle Tiberius Rourke - Cunning Mercenary", () => {
//   it("**WELL, NOW YOU KNOW** When you play this character, chosen opposing character gains **Reckless** during their next turn. _(They can’t quest and must challenge if able.)", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: lyleTiberiusRourkeCunningMercenary.cost,
//         hand: [lyleTiberiusRourkeCunningMercenary],
//       },
//       {
//         play: [liloMakingAWish],
//       },
//     );
//
//     const cardUnderTest = testStore.getCard(lyleTiberiusRourkeCunningMercenary);
//     const target = testStore.getCard(liloMakingAWish);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     testStore.passTurn();
//
//     expect(target.hasReckless).toEqual(true);
//   });
//
//   describe("**THANKS FOR VOLUNTEERING**", () => {
//     it("Whenever one of your other characters is banished, each opponent loses 1 lore.", () => {
//       const testStore = new TestStore({
//         inkwell: dragonFire.cost,
//         hand: [dragonFire],
//         play: [lyleTiberiusRourkeCunningMercenary, liloMakingAWish],
//       });
//
//       testStore.store.tableStore.getTable("player_two").lore = 5;
//
//       const target = testStore.getCard(liloMakingAWish);
//       const banisher = testStore.getCard(dragonFire);
//
//       banisher.playFromHand();
//       testStore.resolveTopOfStack({ targets: [target] });
//       expect(target.zone).toBe("discard");
//       expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
//     });
//
//     it("Whenever one of your other characters is banished, each opponent loses 1 lore. (Should not trigger on himself)", () => {
//       const testStore = new TestStore({
//         inkwell: dragonFire.cost,
//         hand: [dragonFire],
//         play: [lyleTiberiusRourkeCunningMercenary],
//       });
//
//       testStore.store.tableStore.getTable("player_two").lore = 5;
//
//       const target = testStore.getCard(lyleTiberiusRourkeCunningMercenary);
//       const banisher = testStore.getCard(dragonFire);
//
//       banisher.playFromHand();
//       testStore.resolveTopOfStack({ targets: [target] });
//       expect(target.zone).toBe("discard");
//       expect(testStore.store.tableStore.getTable("player_two").lore).toBe(5);
//     });
//
//     it("Grab your Sword Interaction", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: grabYourSword.cost,
//           hand: [grabYourSword],
//         },
//         {
//           play: [
//             lyleTiberiusRourkeCunningMercenary,
//             liloMakingAWish,
//             liloGalacticHero,
//           ],
//         },
//       );
//
//       testEngine.store.tableStore.getTable("player_one").lore = 5;
//
//       const cardUnderTest = testEngine.getCardModel(
//         lyleTiberiusRourkeCunningMercenary,
//       );
//
//       cardUnderTest.updateCardDamage(
//         lyleTiberiusRourkeCunningMercenary.willpower - 1,
//       );
//
//       await testEngine.playCard(grabYourSword);
//
//       expect(testEngine.store.tableStore.getTable("player_one").lore).toBe(3);
//     });
//
//     it("Be prepared interaction", async () => {
//       const testEngine = new TestEngine({
//         inkwell: bePrepared.cost,
//         hand: [bePrepared],
//         play: [
//           lyleTiberiusRourkeCunningMercenary,
//           liloMakingAWish,
//           liloGalacticHero,
//           liloJuniorCakeDecorator,
//         ],
//       });
//
//       testEngine.store.tableStore.getTable("player_two").lore = 5;
//
//       await testEngine.playCard(bePrepared);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveOptionalAbility();
//
//       expect(testEngine.store.tableStore.getTable("player_two").lore).toBe(2);
//     });
//
//     it("Be prepared interaction + 2 Lyles", async () => {
//       const testEngine = new TestEngine({
//         inkwell: bePrepared.cost,
//         hand: [bePrepared],
//         play: [
//           lyleTiberiusRourkeCunningMercenary,
//           lyleTiberiusRourkeCunningMercenary,
//           liloMakingAWish,
//           liloGalacticHero,
//           liloJuniorCakeDecorator,
//         ],
//       });
//
//       testEngine.store.tableStore.getTable("player_two").lore = 10;
//
//       await testEngine.playCard(bePrepared);
//
//       await testEngine.resolveOptionalAbility(true);
//       await testEngine.resolveOptionalAbility(true);
//       await testEngine.resolveOptionalAbility(true);
//       await testEngine.resolveOptionalAbility(true);
//       await testEngine.resolveOptionalAbility(true);
//       await testEngine.resolveOptionalAbility(true);
//
//       await testEngine.resolveOptionalAbility();
//
//       expect(testEngine.store.tableStore.getTable("player_two").lore).toBe(2);
//       expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
