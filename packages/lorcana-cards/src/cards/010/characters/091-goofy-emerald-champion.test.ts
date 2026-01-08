// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   chefLouisInOverHisHead,
//   goofyEmeraldChampion,
//   hadesLookingForADeal,
//   scroogeMcduckShushAgent,
//   webbyVanderquackMysteryEnthusiast,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Goofy - Emerald Champion", () => {
//   describe("Card Properties", () => {
//     it("should have correct properties", async () => {
//       const testEngine = new TestEngine({
//         hand: [goofyEmeraldChampion],
//       });
//
//       const card = testEngine.getCardModel(goofyEmeraldChampion);
//
//       expect(card.name).toBe("Goofy");
//       expect(card.title).toBe("Emerald Champion");
//       expect(card.lorcanitoCard.colors).toEqual(["emerald"]);
//       expect(card.lorcanitoCard.cost).toBe(5);
//       expect(card.lorcanitoCard.strength).toBe(3);
//       expect(card.lorcanitoCard.willpower).toBe(5);
//       expect(card.lorcanitoCard.lore).toBe(2);
//       expect(card.lorcanitoCard.inkwell).toBe(false);
//       expect(card.lorcanitoCard.characteristics).toEqual(["dreamborn", "hero"]);
//     });
//   });
//
//   describe("PROVIDE COVER", () => {
//     it("should grant Ward to other Emerald characters while Goofy is in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: goofyEmeraldChampion.cost + scroogeMcduckShushAgent.cost,
//         play: [goofyEmeraldChampion, scroogeMcduckShushAgent],
//       });
//
//       const goofy = testEngine.getCardModel(goofyEmeraldChampion);
//       const scrooge = testEngine.getCardModel(scroogeMcduckShushAgent);
//
//       // Other Emerald character should have Ward
//       expect(scrooge.hasWard).toBe(true);
//
//       // Goofy himself should not have Ward from his own ability
//       expect(goofy.hasWard).toBe(false);
//     });
//
//     it("should not grant Ward to non-Emerald characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: goofyEmeraldChampion.cost + chefLouisInOverHisHead.cost,
//         play: [goofyEmeraldChampion, chefLouisInOverHisHead],
//       });
//
//       const goofy = testEngine.getCardModel(goofyEmeraldChampion);
//       const chefLouis = testEngine.getCardModel(chefLouisInOverHisHead);
//
//       // Non-Emerald character should not have Ward
//       expect(chefLouis.hasWard).toBe(false);
//
//       // Goofy himself should not have Ward
//       expect(goofy.hasWard).toBe(false);
//     });
//   });
//
//   describe("Abilities", () => {
//     it("should have both EVEN THE SCORE and PROVIDE COVER abilities", async () => {
//       const testEngine = new TestEngine({
//         play: [goofyEmeraldChampion],
//       });
//
//       const goofy = testEngine.getCardModel(goofyEmeraldChampion);
//
//       // Verify the card has the expected abilities
//       expect(goofy.lorcanitoCard.abilities).toBeDefined();
//       expect(goofy.lorcanitoCard.abilities).toHaveLength(2);
//
//       const abilities = goofy.lorcanitoCard.abilities!;
//       const evenTheScoreAbility = abilities[0];
//       const provideCoverAbility = abilities[1];
//
//       // Check names - these should exist on all ability types
//       expect(
//         evenTheScoreAbility &&
//           "name" in evenTheScoreAbility &&
//           evenTheScoreAbility.name,
//       ).toBe("EVEN THE SCORE");
//       expect(
//         provideCoverAbility &&
//           "name" in provideCoverAbility &&
//           provideCoverAbility.name,
//       ).toBe("PROVIDE COVER");
//
//       // Check that the PROVIDE COVER ability has the expected structure for a gain-ability
//       if (
//         provideCoverAbility &&
//         "type" in provideCoverAbility &&
//         "ability" in provideCoverAbility &&
//         provideCoverAbility.type === "static" &&
//         provideCoverAbility.ability === "gain-ability" &&
//         "target" in provideCoverAbility &&
//         provideCoverAbility.target &&
//         provideCoverAbility.target.type === "card" &&
//         "excludeSelf" in provideCoverAbility.target
//       ) {
//         expect(provideCoverAbility.target.excludeSelf).toBe(true);
//       }
//     });
//
//     it("EVEN THE SCORE - banishes challenging character when one of your other Emerald characters is banished in a challenge", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [hadesLookingForADeal],
//         },
//         {
//           play: [goofyEmeraldChampion, webbyVanderquackMysteryEnthusiast],
//         },
//       );
//
//       const attackerModel = testEngine.getCardModel(hadesLookingForADeal);
//       const defenderModel = testEngine.getCardModel(
//         webbyVanderquackMysteryEnthusiast,
//       );
//
//       defenderModel.exert();
//
//       testEngine.testStore.store.cardStore.challenge(
//         attackerModel.instanceId,
//         defenderModel.instanceId,
//       );
//
//       // The defender (Webby) should have been banished (moved to discard)
//       expect(defenderModel.zone).toBe("discard");
//
//       // EVEN THE SCORE should banish the challenging character (Hades)
//       expect(attackerModel.zone).toBe("discard");
//
//       // Goofy should remain in play
//       expect(testEngine.getCardModel(goofyEmeraldChampion).zone).toBe("play");
//     });
//
//     it("EVEN THE SCORE - doesn't banish challenging character when a non-Emerald characters is banished in a challenge", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [chefLouisInOverHisHead],
//         },
//         {
//           play: [goofyEmeraldChampion, hadesLookingForADeal],
//         },
//       );
//
//       const attackerModel = testEngine.getCardModel(chefLouisInOverHisHead);
//       const defenderModel = testEngine.getCardModel(hadesLookingForADeal);
//
//       defenderModel.exert();
//
//       testEngine.testStore.store.cardStore.challenge(
//         attackerModel.instanceId,
//         defenderModel.instanceId,
//       );
//
//       // The defender (Hades) should have been banished (moved to discard)
//       expect(defenderModel.zone).toBe("discard");
//
//       // EVEN THE SCORE should banish the challenging character (Chef Louis)
//       expect(attackerModel.zone).toBe("play");
//
//       // Goofy should remain in play
//       expect(testEngine.getCardModel(goofyEmeraldChampion).zone).toBe("play");
//     });
//
//     it("EVEN THE SCORE - doesn't banish challenging character when Goofy is banished in a challenge", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [chefLouisInOverHisHead],
//         },
//         {
//           play: [goofyEmeraldChampion, hadesLookingForADeal],
//         },
//       );
//
//       const attackerModel = testEngine.getCardModel(chefLouisInOverHisHead);
//       const defenderModel = testEngine.getCardModel(goofyEmeraldChampion);
//
//       defenderModel.exert();
//
//       testEngine.testStore.store.cardStore.challenge(
//         attackerModel.instanceId,
//         defenderModel.instanceId,
//       );
//
//       // The defender (Goofy) should have been banished (moved to discard)
//       expect(defenderModel.zone).toBe("discard");
//
//       // EVEN THE SCORE should not banish the challenging character (Chef Louis)
//       expect(attackerModel.zone).toBe("play");
//     });
//   });
// });
//
