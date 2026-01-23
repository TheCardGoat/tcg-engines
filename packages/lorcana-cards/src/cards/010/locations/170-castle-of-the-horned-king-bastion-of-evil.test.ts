// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { castleOfTheHornedKingBastionOfEvil } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe.skip("Castle of the Horned King - Bastion of Evil", () => {
//   describe("Basic card properties", () => {
//     it("should have correct basic stats", () => {
//       expect(castleOfTheHornedKingBastionOfEvil.cost).toBe(1);
//       expect(castleOfTheHornedKingBastionOfEvil.name).toBe(
//         "Castle of the Horned King",
//       );
//       expect(castleOfTheHornedKingBastionOfEvil.type).toBe("location");
//       expect(castleOfTheHornedKingBastionOfEvil.title).toBe("Bastion of Evil");
//       expect(castleOfTheHornedKingBastionOfEvil.willpower).toBe(5);
//       expect(castleOfTheHornedKingBastionOfEvil.moveCost).toBe(1);
//       expect(castleOfTheHornedKingBastionOfEvil.lore).toBe(0);
//     });
//
//     it("should be emerald location card", () => {
//       expect(castleOfTheHornedKingBastionOfEvil.colors).toEqual(["emerald"]);
//       expect(castleOfTheHornedKingBastionOfEvil.characteristics).toContain(
//         "location",
//       );
//     });
//
//     it("should be inkwell card", () => {
//       expect(castleOfTheHornedKingBastionOfEvil.inkwell).toBe(true);
//     });
//
//     it("should be rare rarity", () => {
//       expect(castleOfTheHornedKingBastionOfEvil.rarity).toBe("rare");
//     });
//
//     it("should have correct set and number", () => {
//       expect(castleOfTheHornedKingBastionOfEvil.set).toBe("010");
//       expect(castleOfTheHornedKingBastionOfEvil.number).toBe(170);
//     });
//
//     it("should have the correct ability text", () => {
//       expect(castleOfTheHornedKingBastionOfEvil.text).toContain(
//         "INTO THE GLOOM Once during your turn, whenever a character quests while here, you may ready chosen item.",
//       );
//     });
//   });
//
//   describe("INTO THE GLOOM ability", () => {
//     it("should be playable from hand with correct ink cost", async () => {
//       const testEngine = new TestEngine({
//         inkwell: castleOfTheHornedKingBastionOfEvil.cost,
//         hand: [castleOfTheHornedKingBastionOfEvil],
//       });
//
//       const cardModel = testEngine.getCardModel(
//         castleOfTheHornedKingBastionOfEvil,
//       );
//
//       expect(cardModel.zone).toBe("hand");
//
//       await testEngine.playCard(castleOfTheHornedKingBastionOfEvil);
//
//       expect(cardModel.zone).toBe("play");
//       expect(
//         testEngine.store.tableStore.getTable("player_one").inkAvailable(),
//       ).toBe(0);
//     });
//
//     it("should be able to be used as ink", async () => {
//       const testEngine = new TestEngine({
//         hand: [castleOfTheHornedKingBastionOfEvil],
//       });
//
//       const cardModel = testEngine.getCardModel(
//         castleOfTheHornedKingBastionOfEvil,
//       );
//
//       expect(cardModel.zone).toBe("hand");
//       expect(cardModel.lorcanitoCard.inkwell).toBe(true);
//
//       const initialInkwellSize =
//         testEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//           .length;
//
//       cardModel.addToInkwell();
//
//       expect(cardModel.zone).toBe("inkwell");
//       expect(
//         testEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//           .length,
//       ).toBe(initialInkwellSize + 1);
//     });
//
//     it("should have the INTO THE GLOOM ability properly implemented", () => {
//       const testEngine = new TestEngine({
//         play: [castleOfTheHornedKingBastionOfEvil],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         castleOfTheHornedKingBastionOfEvil,
//       );
//
//       // Verify the ability is now implemented
//       expect(cardUnderTest.lorcanitoCard.abilities?.length).toBeGreaterThan(0);
//       expect(cardUnderTest.lorcanitoCard.notImplemented).toBeUndefined();
//       expect(cardUnderTest.lorcanitoCard.missingTestCase).toBeUndefined();
//     });
//
//     it("should have correct ability structure", () => {
//       const testEngine = new TestEngine({
//         play: [castleOfTheHornedKingBastionOfEvil],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         castleOfTheHornedKingBastionOfEvil,
//       );
//       const ability = cardUnderTest.lorcanitoCard.abilities?.[0];
//
//       // Verify ability exists and has correct structure
//       expect(ability).toBeDefined();
//       if (!ability) return;
//
//       // Verify it's a static ability that grants a triggered ability while here
//       expect((ability as any).type).toBe("static");
//       expect((ability as any).ability).toBe("gain-ability");
//       expect((ability as any).name).toBe("INTO THE GLOOM");
//
//       // Verify the gained ability is a triggered ability
//       const gainedAbility = (ability as any).gainedAbility;
//       expect(gainedAbility.type).toBe("static-triggered");
//
//       // Verify it's optional (may ready)
//       expect(gainedAbility.layer.optional).toBe(true);
//
//       // Verify the trigger is about characters questing
//       expect(gainedAbility.trigger.on).toBe("quest");
//
//       // Verify the effects include readying an item (exert with false = ready)
//       expect(gainedAbility.layer.effects).toHaveLength(1);
//       expect(gainedAbility.layer.effects[0].type).toBe("exert");
//       expect(gainedAbility.layer.effects[0].exert).toBe(false);
//     });
//   });
// });
//
