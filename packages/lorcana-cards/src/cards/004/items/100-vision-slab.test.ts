// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuck,
//   MickeyBraveLittleTailor,
//   RapunzelGiftedWithHealing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   GoofyKnightForADay,
//   MadamMimSnake,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   BelleAccomplishedMystic,
//   GoofySuperGoof,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { visionSlab } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import {
//   LuisaMadrigalEntertainingMuscle,
//   WhiteRabbitRoyalHerald,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Vision Slab", () => {
//   Describe("**TRAPPED!** Damage counters can't be removed.", () => {
//     It("Prevent Removing Damage", async () => {
//       Const testEngine = new TestEngine({
//         Play: [goofyKnightForADay, visionSlab],
//         Hand: [rapunzelGiftedWithHealing],
//         Inkwell: rapunzelGiftedWithHealing.cost,
//       });
//
//       Await testEngine.setCardDamage(goofyKnightForADay, 5);
//       Await testEngine.playCard(rapunzelGiftedWithHealing, {
//         Targets: [goofyKnightForADay],
//       });
//
//       Expect(testEngine.getCardModel(goofyKnightForADay).damage).toEqual(5);
//     });
//
//     It("Prevent Moving Damage", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: belleAccomplishedMystic.cost * 2 + madamMimSnake.cost,
//           Play: [goofySuperGoof, donaldDuck, visionSlab],
//           Hand: [belleAccomplishedMystic, madamMimSnake],
//         },
//         {
//           Play: [mickeyBraveLittleTailor, goofyKnightForADay],
//         },
//       );
//
//       Await testEngine.setCardDamage(donaldDuck, 2);
//       Await testEngine.playCard(
//         BelleAccomplishedMystic,
//         {
//           Targets: [donaldDuck],
//         },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Targets: [goofyKnightForADay],
//       });
//
//       Expect(testEngine.getCardModel(donaldDuck).damage).toBe(2);
//       Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(0);
//     });
//
//     It("Applies to both players' cards", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [whiteRabbitRoyalHerald],
//           Hand: [visionSlab],
//           Inkwell: visionSlab.cost,
//         },
//         {
//           Play: [luisaMadrigalEntertainingMuscle],
//         },
//       );
//
//       Const ownCharacter = testEngine.getCardModel(whiteRabbitRoyalHerald);
//       Const opponentsCard = testEngine.getCardModel(
//         LuisaMadrigalEntertainingMuscle,
//       );
//
//       Expect(
//         TestEngine.store.effectStore.getAbilitiesForCard(ownCharacter),
//       ).toHaveLength(0);
//       Expect(
//         TestEngine.store.effectStore.getAbilitiesForCard(opponentsCard),
//       ).toHaveLength(0);
//
//       Await testEngine.playCard(visionSlab);
//
//       Expect(
//         TestEngine.store.effectStore.getAbilitiesForCard(ownCharacter).at(0)
//           ?.name,
//       ).toEqual("TRAPPED!");
//       Expect(
//         TestEngine.store.effectStore.getAbilitiesForCard(opponentsCard).at(0)
//           ?.name,
//       ).toEqual("TRAPPED!");
//     });
//   });
//
//   Describe("**DANGER REVEALED** At the start of your turn, if an opposing character has damage, gain 1 lore. ", () => {
//     It("Gives 1 lore if opponent has damaged character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [whiteRabbitRoyalHerald],
//         },
//         {
//           Play: [luisaMadrigalEntertainingMuscle, visionSlab],
//         },
//       );
//
//       Await testEngine.setCardDamage(whiteRabbitRoyalHerald, 1);
//
//       Expect(testEngine.getLoreForPlayer("player_two")).toEqual(0);
//       Await testEngine.passTurn();
//       Expect(testEngine.getLoreForPlayer("player_two")).toEqual(1);
//     });
//   });
// });
//
