// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it, test } from "@jest/globals";
// Import { developYourBrain } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   ChiefTui,
//   MagicBroomBucketBrigade,
//   MoanaOfMotunui,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import {
//   AWholeNewWorld,
//   FriendsOnTheOtherSide,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { brawl } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import {
//   DiabloDevotedHerald,
//   DiabloMaleficentsSpy,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Diablo - Devoted Herald", () => {
//   It("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     Const testStore = new TestStore({
//       Play: [diabloDevotedHerald],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DiabloDevotedHerald.id,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("**Shift: Discard an action card** _(You may discard an action card to play this on top of one of your characters named Diablo.)", () => {
//     Const testStore = new TestStore({
//       Inkwell: diabloDevotedHerald.cost,
//       Play: [diabloMaleficentsSpy],
//       Hand: [brawl, diabloDevotedHerald],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       DiabloDevotedHerald.id,
//     );
//     Const cardToDiscard = testStore.getByZoneAndId("hand", brawl.id);
//     Const shiftTarget = testStore.getByZoneAndId(
//       "play",
//       DiabloMaleficentsSpy.id,
//     );
//
//     CardUnderTest.shift(shiftTarget, [cardToDiscard]);
//
//     Expect(cardUnderTest.zone).toBe("play");
//     Expect(cardToDiscard.zone).toBe("discard");
//   });
//
//   Describe("**CIRCLE FAR AND WIDE** During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.", () => {
//     It("Should trigger when opponent draws a card", () => {
//       Const testStore = new TestStore(
//         {
//           Deck: 2,
//           Hand: [friendsOnTheOtherSide],
//           Inkwell: friendsOnTheOtherSide.cost,
//         },
//         {
//           Play: [diabloDevotedHerald],
//           Deck: 7,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         DiabloDevotedHerald.id,
//         "player_two",
//       );
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Expect(cardUnderTest.meta.exerted).toBe(true);
//
//       Const cardDraw = testStore.getByZoneAndId(
//         "hand",
//         FriendsOnTheOtherSide.id,
//       );
//
//       CardDraw.playFromHand();
//       TestStore.changePlayer("player_two");
//
//       TestStore.resolveOptionalAbility();
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ deck: 6, hand: 1 }),
//       );
//
//       TestStore.resolveOptionalAbility();
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ deck: 5, hand: 2 }),
//       );
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("Should not trigger when Diablo is not exerted", () => {
//       Const testStore = new TestStore(
//         {
//           Deck: 2,
//           Hand: [friendsOnTheOtherSide],
//           Inkwell: friendsOnTheOtherSide.cost,
//         },
//         {
//           Play: [diabloDevotedHerald],
//           Deck: 7,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         DiabloDevotedHerald.id,
//         "player_two",
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: false });
//       Expect(cardUnderTest.meta.exerted).toBe(false);
//
//       Const cardDraw = testStore.getByZoneAndId(
//         "hand",
//         FriendsOnTheOtherSide.id,
//       );
//
//       CardDraw.playFromHand();
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ deck: 7, hand: 0 }),
//       );
//     });
//
//     It("Should not trigger on player's turn", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: aWholeNewWorld.cost,
//           Hand: [dingleHopper, aWholeNewWorld],
//           Play: [diabloDevotedHerald],
//           Deck: 7,
//         },
//         {
//           Hand: [magicBroomBucketBrigade, teKaTheBurningOne, moanaOfMotunui],
//           Deck: 7,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         DiabloDevotedHerald.id,
//         "player_one",
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Expect(cardUnderTest.meta.exerted).toBe(true);
//
//       TestStore.store.playCardFromHand(
//         TestStore.getByZoneAndId("hand", aWholeNewWorld.id).instanceId,
//       );
//
//       // At the end of aWholeNewWorld, the player should have drawn 7 cards thus creating 7 layers to resolve
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("Whole new world test case", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: aWholeNewWorld.cost,
//           Hand: [dingleHopper, aWholeNewWorld],
//           Deck: 7,
//         },
//         {
//           Hand: [magicBroomBucketBrigade, teKaTheBurningOne, moanaOfMotunui],
//           Play: [diabloDevotedHerald],
//           Deck: 7,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         DiabloDevotedHerald.id,
//         "player_two",
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Expect(cardUnderTest.meta.exerted).toBe(true);
//
//       TestStore.store.playCardFromHand(
//         TestStore.getByZoneAndId("hand", aWholeNewWorld.id).instanceId,
//       );
//
//       // At the end of aWholeNewWorld, the player should have drawn 7 cards thus creating 7 layers to resolve
//       Expect(testStore.stackLayers).toHaveLength(7);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   Test("Let the Storm Rage On, Interaction", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: letTheStormRageOn.cost,
//         Hand: [letTheStormRageOn],
//         Deck: 2,
//       },
//       {
//         Play: [diabloDevotedHerald],
//         Deck: 7,
//       },
//     );
//
//     Await testEngine.tapCard(diabloDevotedHerald);
//     Await testEngine.playCard(
//       LetTheStormRageOn,
//       {
//         Targets: [diabloDevotedHerald],
//       },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(diabloDevotedHerald).zone).toEqual(
//       "discard",
//     );
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ deck: 1, hand: 1, discard: 1 }),
//     );
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ deck: 7, hand: 0 }),
//     );
//     Expect(testEngine.stackLayers).toHaveLength(1);
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ deck: 1, hand: 1, discard: 1 }),
//     );
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ deck: 6, hand: 1, discard: 1 }),
//     );
//   });
//
//   It("Should NOT draw a card when player puts a card in card (instead of drawing)", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: developYourBrain.cost,
//         Hand: [developYourBrain],
//         Deck: [chiefTui, moanaOfMotunui],
//       },
//       {
//         Play: [diabloDevotedHerald],
//         Deck: 7,
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(diabloDevotedHerald);
//     CardUnderTest.updateCardMeta({ exerted: true });
//     Expect(cardUnderTest.meta.exerted).toBe(true);
//
//     Const cardToPutInHand = testStore.getCard(developYourBrain);
//     CardToPutInHand.playFromHand();
//
//     Const first = testStore.getCard(moanaOfMotunui);
//     Const second = testStore.getCard(chiefTui);
//     TestStore.resolveTopOfStack({ scry: { bottom: [first], hand: [second] } });
//
//     Expect(testStore.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ deck: 1, hand: 1, discard: 1 }),
//     );
//
//     Expect(testStore.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ deck: 7, hand: 0 }),
//     );
//
//     Expect(testStore.stackLayers).toHaveLength(0);
//   });
//
//   It("Should draw multiple cards, when opponent draws multiple", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [hiramFlavershamToymaker, pawpsicle],
//         Deck: 5,
//       },
//       {
//         Play: [diabloDevotedHerald],
//         Deck: 5,
//       },
//     );
//
//     Await testEngine.tapCard(diabloDevotedHerald);
//
//     Await testEngine.questCard(
//       HiramFlavershamToymaker,
//       {
//         Targets: [pawpsicle],
//       },
//       True,
//     );
//
//     Expect(testEngine.stackLayers).toHaveLength(2);
//   });
// });
//
