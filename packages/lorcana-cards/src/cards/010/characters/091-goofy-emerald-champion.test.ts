// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChefLouisInOverHisHead,
//   GoofyEmeraldChampion,
//   HadesLookingForADeal,
//   ScroogeMcduckShushAgent,
//   WebbyVanderquackMysteryEnthusiast,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goofy - Emerald Champion", () => {
//   Describe("Card Properties", () => {
//     It("should have correct properties", async () => {
//       Const testEngine = new TestEngine({
//         Hand: [goofyEmeraldChampion],
//       });
//
//       Const card = testEngine.getCardModel(goofyEmeraldChampion);
//
//       Expect(card.name).toBe("Goofy");
//       Expect(card.title).toBe("Emerald Champion");
//       Expect(card.lorcanitoCard.colors).toEqual(["emerald"]);
//       Expect(card.lorcanitoCard.cost).toBe(5);
//       Expect(card.lorcanitoCard.strength).toBe(3);
//       Expect(card.lorcanitoCard.willpower).toBe(5);
//       Expect(card.lorcanitoCard.lore).toBe(2);
//       Expect(card.lorcanitoCard.inkwell).toBe(false);
//       Expect(card.lorcanitoCard.characteristics).toEqual(["dreamborn", "hero"]);
//     });
//   });
//
//   Describe("PROVIDE COVER", () => {
//     It("should grant Ward to other Emerald characters while Goofy is in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: goofyEmeraldChampion.cost + scroogeMcduckShushAgent.cost,
//         Play: [goofyEmeraldChampion, scroogeMcduckShushAgent],
//       });
//
//       Const goofy = testEngine.getCardModel(goofyEmeraldChampion);
//       Const scrooge = testEngine.getCardModel(scroogeMcduckShushAgent);
//
//       // Other Emerald character should have Ward
//       Expect(scrooge.hasWard).toBe(true);
//
//       // Goofy himself should not have Ward from his own ability
//       Expect(goofy.hasWard).toBe(false);
//     });
//
//     It("should not grant Ward to non-Emerald characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: goofyEmeraldChampion.cost + chefLouisInOverHisHead.cost,
//         Play: [goofyEmeraldChampion, chefLouisInOverHisHead],
//       });
//
//       Const goofy = testEngine.getCardModel(goofyEmeraldChampion);
//       Const chefLouis = testEngine.getCardModel(chefLouisInOverHisHead);
//
//       // Non-Emerald character should not have Ward
//       Expect(chefLouis.hasWard).toBe(false);
//
//       // Goofy himself should not have Ward
//       Expect(goofy.hasWard).toBe(false);
//     });
//   });
//
//   Describe("Abilities", () => {
//     It("should have both EVEN THE SCORE and PROVIDE COVER abilities", async () => {
//       Const testEngine = new TestEngine({
//         Play: [goofyEmeraldChampion],
//       });
//
//       Const goofy = testEngine.getCardModel(goofyEmeraldChampion);
//
//       // Verify the card has the expected abilities
//       Expect(goofy.lorcanitoCard.abilities).toBeDefined();
//       Expect(goofy.lorcanitoCard.abilities).toHaveLength(2);
//
//       Const abilities = goofy.lorcanitoCard.abilities!;
//       Const evenTheScoreAbility = abilities[0];
//       Const provideCoverAbility = abilities[1];
//
//       // Check names - these should exist on all ability types
//       Expect(
//         EvenTheScoreAbility &&
//           "name" in evenTheScoreAbility &&
//           EvenTheScoreAbility.name,
//       ).toBe("EVEN THE SCORE");
//       Expect(
//         ProvideCoverAbility &&
//           "name" in provideCoverAbility &&
//           ProvideCoverAbility.name,
//       ).toBe("PROVIDE COVER");
//
//       // Check that the PROVIDE COVER ability has the expected structure for a gain-ability
//       If (
//         ProvideCoverAbility &&
//         "type" in provideCoverAbility &&
//         "ability" in provideCoverAbility &&
//         ProvideCoverAbility.type === "static" &&
//         ProvideCoverAbility.ability === "gain-ability" &&
//         "target" in provideCoverAbility &&
//         ProvideCoverAbility.target &&
//         ProvideCoverAbility.target.type === "card" &&
//         "excludeSelf" in provideCoverAbility.target
//       ) {
//         Expect(provideCoverAbility.target.excludeSelf).toBe(true);
//       }
//     });
//
//     It("EVEN THE SCORE - banishes challenging character when one of your other Emerald characters is banished in a challenge", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [hadesLookingForADeal],
//         },
//         {
//           Play: [goofyEmeraldChampion, webbyVanderquackMysteryEnthusiast],
//         },
//       );
//
//       Const attackerModel = testEngine.getCardModel(hadesLookingForADeal);
//       Const defenderModel = testEngine.getCardModel(
//         WebbyVanderquackMysteryEnthusiast,
//       );
//
//       DefenderModel.exert();
//
//       TestEngine.testStore.store.cardStore.challenge(
//         AttackerModel.instanceId,
//         DefenderModel.instanceId,
//       );
//
//       // The defender (Webby) should have been banished (moved to discard)
//       Expect(defenderModel.zone).toBe("discard");
//
//       // EVEN THE SCORE should banish the challenging character (Hades)
//       Expect(attackerModel.zone).toBe("discard");
//
//       // Goofy should remain in play
//       Expect(testEngine.getCardModel(goofyEmeraldChampion).zone).toBe("play");
//     });
//
//     It("EVEN THE SCORE - doesn't banish challenging character when a non-Emerald characters is banished in a challenge", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [chefLouisInOverHisHead],
//         },
//         {
//           Play: [goofyEmeraldChampion, hadesLookingForADeal],
//         },
//       );
//
//       Const attackerModel = testEngine.getCardModel(chefLouisInOverHisHead);
//       Const defenderModel = testEngine.getCardModel(hadesLookingForADeal);
//
//       DefenderModel.exert();
//
//       TestEngine.testStore.store.cardStore.challenge(
//         AttackerModel.instanceId,
//         DefenderModel.instanceId,
//       );
//
//       // The defender (Hades) should have been banished (moved to discard)
//       Expect(defenderModel.zone).toBe("discard");
//
//       // EVEN THE SCORE should banish the challenging character (Chef Louis)
//       Expect(attackerModel.zone).toBe("play");
//
//       // Goofy should remain in play
//       Expect(testEngine.getCardModel(goofyEmeraldChampion).zone).toBe("play");
//     });
//
//     It("EVEN THE SCORE - doesn't banish challenging character when Goofy is banished in a challenge", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [chefLouisInOverHisHead],
//         },
//         {
//           Play: [goofyEmeraldChampion, hadesLookingForADeal],
//         },
//       );
//
//       Const attackerModel = testEngine.getCardModel(chefLouisInOverHisHead);
//       Const defenderModel = testEngine.getCardModel(goofyEmeraldChampion);
//
//       DefenderModel.exert();
//
//       TestEngine.testStore.store.cardStore.challenge(
//         AttackerModel.instanceId,
//         DefenderModel.instanceId,
//       );
//
//       // The defender (Goofy) should have been banished (moved to discard)
//       Expect(defenderModel.zone).toBe("discard");
//
//       // EVEN THE SCORE should not banish the challenging character (Chef Louis)
//       Expect(attackerModel.zone).toBe("play");
//     });
//   });
// });
//
