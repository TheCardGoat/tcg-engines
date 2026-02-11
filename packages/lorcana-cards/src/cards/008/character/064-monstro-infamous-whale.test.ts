// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import type { CardModel } from "@lorcanito/lorcana-engine";
// Import { weKnowTheWay } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { alanadaleRockinRooster } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   DeweyLovableShowoff,
//   DonaldDuckCoinCollector,
//   MonstroInfamousWhale,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { elsaSpiritOfWinter } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import type { GenerateOnDemandLayerMove } from "@lorcanito/shared";
// Import { moneyEverywhere } from "./037-donaldDuckCoinCollector";
// Import {
//   FullBreach,
//   FullBreachAndMoneyEverywhereCombo,
// } from "./064-monstro-infamous-whale";
//
// Describe("Monstro - Infamous Whale", () => {
//   It("Rush (This character can challenge the turn they're played.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [monstroInfamousWhale],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(monstroInfamousWhale);
//     Expect(cardUnderTest.hasRush).toBe(true);
//   });
//
//   It("FULL BREACH Choose and discard a card – Ready this character. He can't quest for the rest of this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [monstroInfamousWhale],
//       Hand: [deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(monstroInfamousWhale);
//     Const target: CardModel = testEngine.getCardModel(deweyLovableShowoff);
//
//     CardUnderTest.exert();
//     Expect(cardUnderTest.exerted).toEqual(true);
//
//     CardUnderTest.activate("FULL BREACH", { costs: [target] });
//
//     Expect(cardUnderTest.exerted).toEqual(false);
//   });
// });
//
// Describe("Infinite Loop", () => {
//   // Note this is a work-around, so don't this as example
//   It("Adds a helper function to RootStore", async () => {
//     Const testEngine = new TestEngine({
//       Play: [monstroInfamousWhale],
//       Hand: [donaldDuckCoinCollector, alanadaleRockinRooster, weKnowTheWay],
//       Deck: 60,
//     });
//
//     TestEngine.assertThatZonesContain({
//       Hand: 3,
//       Deck: 60,
//       Discard: 0,
//     });
//
//     Const move: GenerateOnDemandLayerMove = {
//       Type: "GENERATE_ON_DEMAND_LAYER",
//       InstanceId: testEngine.getCardModel(monstroInfamousWhale).instanceId,
//       Ability: fullBreachAndMoneyEverywhereCombo as unknown as Record<
//         String,
//         Unknown
//       >,
//     };
//     Await testEngine.engine.execute(move);
//
//     TestEngine.assertThatZonesContain({
//       Hand: 63,
//       Deck: 0,
//       Discard: 0,
//     });
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//
//     Const hand = testEngine.store.tableStore.getPlayerZone(
//       "player_one",
//       "hand",
//     ).cards;
//     Const targets = hand.slice(0, 60);
//
//     Await testEngine.resolveTopOfStack({
//       Targets,
//     });
//
//     TestEngine.assertThatZonesContain({
//       Hand: 3,
//       Deck: 0,
//       Discard: 60,
//     });
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
//
//   It("Should not create infinite continuous effects, or else it breaks the transport mechanism", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: donaldDuckCoinCollector.cost,
//       Play: [monstroInfamousWhale],
//       Hand: [donaldDuckCoinCollector],
//       Deck: 60,
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(monstroInfamousWhale);
//     Expect(cardUnderTest.activatedAbilities).toHaveLength(1);
//     Expect(
//       TestEngine.store.continuousEffectStore.continuousEffects,
//     ).toHaveLength(0);
//
//     Await testEngine.playCard(donaldDuckCoinCollector);
//
//     Expect(cardUnderTest.activatedAbilities).toHaveLength(2);
//     Expect(
//       TestEngine.store.continuousEffectStore.continuousEffects,
//     ).toHaveLength(2); // Donald and Monstro are both with Donald's continuous effect
//
//     TestEngine.assertThatZonesContain({
//       Deck: 60,
//       Hand: 0,
//     });
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: moneyEverywhere.name,
//     });
//
//     TestEngine.assertThatZonesContain({
//       Deck: 59,
//       Hand: 1,
//       Discard: 0,
//     });
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: fullBreach.name,
//       Costs: [testEngine.getACardFromHand()],
//     });
//
//     TestEngine.assertThatZonesContain({
//       Deck: 59,
//       Hand: 0,
//       Discard: 1,
//     });
//
//     // Once Monstro Discards, he will untap and can't quest until the end of the turn.
//     Expect(cardUnderTest.exerted).toEqual(false);
//     Expect(cardUnderTest.hasQuestRestriction).toEqual(true);
//     Expect(
//       TestEngine.store.continuousEffectStore.continuousEffects,
//     ).toHaveLength(3); // Added Monstro's continuous effect, as he can't quest for the rest of the turn.
//
//     // Now if we repeat this indefinitely, we don't want to have infinite continuous effects.
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: moneyEverywhere.name,
//     });
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: fullBreach.name,
//       Costs: [testEngine.getACardFromHand()],
//     });
//
//     Expect(cardUnderTest.hasQuestRestriction).toEqual(true);
//     Expect(
//       TestEngine.store.continuousEffectStore.continuousEffects,
//     ).toHaveLength(3); // instead of adding another continuous effect, we should skip adding the same one again.
//
//     // Doing one more time to ensure it works consistently
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: moneyEverywhere.name,
//     });
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: fullBreach.name,
//       Costs: [testEngine.getACardFromHand()],
//     });
//
//     Expect(
//       TestEngine.store.continuousEffectStore.continuousEffects,
//     ).toHaveLength(3);
//   });
// });
//
// Describe("Regression Tests", () => {
//   It("should NOT be blocked by 'cant ready at the start of the turn' effects", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: elsaSpiritOfWinter.cost,
//         Hand: [elsaSpiritOfWinter],
//       },
//       {
//         Play: [monstroInfamousWhale],
//         Hand: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(monstroInfamousWhale);
//     Const target: CardModel = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.playCard(elsaSpiritOfWinter, {
//       Targets: [cardUnderTest],
//       AcceptOptionalLayer: true,
//     });
//     Expect(cardUnderTest.exerted).toEqual(true);
//     Await testEngine.passTurn();
//     Expect(cardUnderTest.exerted).toEqual(true);
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "FULL BREACH",
//       Costs: [target],
//     });
//
//     Expect(cardUnderTest.exerted).toEqual(false);
//   });
// });
//
