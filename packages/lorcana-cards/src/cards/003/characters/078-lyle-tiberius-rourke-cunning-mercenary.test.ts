// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   LiloGalacticHero,
//   LiloMakingAWish,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   BePrepared,
//   GrabYourSword,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { lyleTiberiusRourkeCunningMercenary } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { liloJuniorCakeDecorator } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lyle Tiberius Rourke - Cunning Mercenary", () => {
//   It("**WELL, NOW YOU KNOW** When you play this character, chosen opposing character gains **Reckless** during their next turn. _(They can’t quest and must challenge if able.)", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: lyleTiberiusRourkeCunningMercenary.cost,
//         Hand: [lyleTiberiusRourkeCunningMercenary],
//       },
//       {
//         Play: [liloMakingAWish],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(lyleTiberiusRourkeCunningMercenary);
//     Const target = testStore.getCard(liloMakingAWish);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     TestStore.passTurn();
//
//     Expect(target.hasReckless).toEqual(true);
//   });
//
//   Describe("**THANKS FOR VOLUNTEERING**", () => {
//     It("Whenever one of your other characters is banished, each opponent loses 1 lore.", () => {
//       Const testStore = new TestStore({
//         Inkwell: dragonFire.cost,
//         Hand: [dragonFire],
//         Play: [lyleTiberiusRourkeCunningMercenary, liloMakingAWish],
//       });
//
//       TestStore.store.tableStore.getTable("player_two").lore = 5;
//
//       Const target = testStore.getCard(liloMakingAWish);
//       Const banisher = testStore.getCard(dragonFire);
//
//       Banisher.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//       Expect(target.zone).toBe("discard");
//       Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
//     });
//
//     It("Whenever one of your other characters is banished, each opponent loses 1 lore. (Should not trigger on himself)", () => {
//       Const testStore = new TestStore({
//         Inkwell: dragonFire.cost,
//         Hand: [dragonFire],
//         Play: [lyleTiberiusRourkeCunningMercenary],
//       });
//
//       TestStore.store.tableStore.getTable("player_two").lore = 5;
//
//       Const target = testStore.getCard(lyleTiberiusRourkeCunningMercenary);
//       Const banisher = testStore.getCard(dragonFire);
//
//       Banisher.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//       Expect(target.zone).toBe("discard");
//       Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(5);
//     });
//
//     It("Grab your Sword Interaction", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: grabYourSword.cost,
//           Hand: [grabYourSword],
//         },
//         {
//           Play: [
//             LyleTiberiusRourkeCunningMercenary,
//             LiloMakingAWish,
//             LiloGalacticHero,
//           ],
//         },
//       );
//
//       TestEngine.store.tableStore.getTable("player_one").lore = 5;
//
//       Const cardUnderTest = testEngine.getCardModel(
//         LyleTiberiusRourkeCunningMercenary,
//       );
//
//       CardUnderTest.updateCardDamage(
//         LyleTiberiusRourkeCunningMercenary.willpower - 1,
//       );
//
//       Await testEngine.playCard(grabYourSword);
//
//       Expect(testEngine.store.tableStore.getTable("player_one").lore).toBe(3);
//     });
//
//     It("Be prepared interaction", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: bePrepared.cost,
//         Hand: [bePrepared],
//         Play: [
//           LyleTiberiusRourkeCunningMercenary,
//           LiloMakingAWish,
//           LiloGalacticHero,
//           LiloJuniorCakeDecorator,
//         ],
//       });
//
//       TestEngine.store.tableStore.getTable("player_two").lore = 5;
//
//       Await testEngine.playCard(bePrepared);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(testEngine.store.tableStore.getTable("player_two").lore).toBe(2);
//     });
//
//     It("Be prepared interaction + 2 Lyles", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: bePrepared.cost,
//         Hand: [bePrepared],
//         Play: [
//           LyleTiberiusRourkeCunningMercenary,
//           LyleTiberiusRourkeCunningMercenary,
//           LiloMakingAWish,
//           LiloGalacticHero,
//           LiloJuniorCakeDecorator,
//         ],
//       });
//
//       TestEngine.store.tableStore.getTable("player_two").lore = 10;
//
//       Await testEngine.playCard(bePrepared);
//
//       Await testEngine.resolveOptionalAbility(true);
//       Await testEngine.resolveOptionalAbility(true);
//       Await testEngine.resolveOptionalAbility(true);
//       Await testEngine.resolveOptionalAbility(true);
//       Await testEngine.resolveOptionalAbility(true);
//       Await testEngine.resolveOptionalAbility(true);
//
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(testEngine.store.tableStore.getTable("player_two").lore).toBe(2);
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
