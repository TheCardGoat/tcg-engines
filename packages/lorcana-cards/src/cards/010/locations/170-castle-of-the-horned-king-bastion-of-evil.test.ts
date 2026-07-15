// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { castleOfTheHornedKingBastionOfEvil } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe.skip("Castle of the Horned King - Bastion of Evil", () => {
//   Describe("Basic card properties", () => {
//     It("should have correct basic stats", () => {
//       Expect(castleOfTheHornedKingBastionOfEvil.cost).toBe(1);
//       Expect(castleOfTheHornedKingBastionOfEvil.name).toBe(
//         "Castle of the Horned King",
//       );
//       Expect(castleOfTheHornedKingBastionOfEvil.type).toBe("location");
//       Expect(castleOfTheHornedKingBastionOfEvil.title).toBe("Bastion of Evil");
//       Expect(castleOfTheHornedKingBastionOfEvil.willpower).toBe(5);
//       Expect(castleOfTheHornedKingBastionOfEvil.moveCost).toBe(1);
//       Expect(castleOfTheHornedKingBastionOfEvil.lore).toBe(0);
//     });
//
//     It("should be emerald location card", () => {
//       Expect(castleOfTheHornedKingBastionOfEvil.colors).toEqual(["emerald"]);
//       Expect(castleOfTheHornedKingBastionOfEvil.characteristics).toContain(
//         "location",
//       );
//     });
//
//     It("should be inkwell card", () => {
//       Expect(castleOfTheHornedKingBastionOfEvil.inkwell).toBe(true);
//     });
//
//     It("should be rare rarity", () => {
//       Expect(castleOfTheHornedKingBastionOfEvil.rarity).toBe("rare");
//     });
//
//     It("should have correct set and number", () => {
//       Expect(castleOfTheHornedKingBastionOfEvil.set).toBe("010");
//       Expect(castleOfTheHornedKingBastionOfEvil.number).toBe(170);
//     });
//
//     It("should have the correct ability text", () => {
//       Expect(castleOfTheHornedKingBastionOfEvil.text).toContain(
//         "INTO THE GLOOM Once during your turn, whenever a character quests while here, you may ready chosen item.",
//       );
//     });
//   });
//
//   Describe("INTO THE GLOOM ability", () => {
//     It("should be playable from hand with correct ink cost", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: castleOfTheHornedKingBastionOfEvil.cost,
//         Hand: [castleOfTheHornedKingBastionOfEvil],
//       });
//
//       Const cardModel = testEngine.getCardModel(
//         CastleOfTheHornedKingBastionOfEvil,
//       );
//
//       Expect(cardModel.zone).toBe("hand");
//
//       Await testEngine.playCard(castleOfTheHornedKingBastionOfEvil);
//
//       Expect(cardModel.zone).toBe("play");
//       Expect(
//         TestEngine.store.tableStore.getTable("player_one").inkAvailable(),
//       ).toBe(0);
//     });
//
//     It("should be able to be used as ink", async () => {
//       Const testEngine = new TestEngine({
//         Hand: [castleOfTheHornedKingBastionOfEvil],
//       });
//
//       Const cardModel = testEngine.getCardModel(
//         CastleOfTheHornedKingBastionOfEvil,
//       );
//
//       Expect(cardModel.zone).toBe("hand");
//       Expect(cardModel.lorcanitoCard.inkwell).toBe(true);
//
//       Const initialInkwellSize =
//         TestEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//           .length;
//
//       CardModel.addToInkwell();
//
//       Expect(cardModel.zone).toBe("inkwell");
//       Expect(
//         TestEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//           .length,
//       ).toBe(initialInkwellSize + 1);
//     });
//
//     It("should have the INTO THE GLOOM ability properly implemented", () => {
//       Const testEngine = new TestEngine({
//         Play: [castleOfTheHornedKingBastionOfEvil],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         CastleOfTheHornedKingBastionOfEvil,
//       );
//
//       // Verify the ability is now implemented
//       Expect(cardUnderTest.lorcanitoCard.abilities?.length).toBeGreaterThan(0);
//       Expect(cardUnderTest.lorcanitoCard.notImplemented).toBeUndefined();
//       Expect(cardUnderTest.lorcanitoCard.missingTestCase).toBeUndefined();
//     });
//
//     It("should have correct ability structure", () => {
//       Const testEngine = new TestEngine({
//         Play: [castleOfTheHornedKingBastionOfEvil],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         CastleOfTheHornedKingBastionOfEvil,
//       );
//       Const ability = cardUnderTest.lorcanitoCard.abilities?.[0];
//
//       // Verify ability exists and has correct structure
//       Expect(ability).toBeDefined();
//       If (!ability) return;
//
//       // Verify it's a static ability that grants a triggered ability while here
//       Expect((ability as any).type).toBe("static");
//       Expect((ability as any).ability).toBe("gain-ability");
//       Expect((ability as any).name).toBe("INTO THE GLOOM");
//
//       // Verify the gained ability is a triggered ability
//       Const gainedAbility = (ability as any).gainedAbility;
//       Expect(gainedAbility.type).toBe("static-triggered");
//
//       // Verify it's optional (may ready)
//       Expect(gainedAbility.layer.optional).toBe(true);
//
//       // Verify the trigger is about characters questing
//       Expect(gainedAbility.trigger.on).toBe("quest");
//
//       // Verify the effects include readying an item (exert with false = ready)
//       Expect(gainedAbility.layer.effects).toHaveLength(1);
//       Expect(gainedAbility.layer.effects[0].type).toBe("exert");
//       Expect(gainedAbility.layer.effects[0].exert).toBe(false);
//     });
//   });
// });
//
