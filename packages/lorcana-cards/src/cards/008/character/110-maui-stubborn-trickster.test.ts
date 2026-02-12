// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   MoanChosenByTheOcean,
//   TamatoaSoShiny,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import {
//   LuckyDime,
//   MauisFishHook,
// } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { mauisPlaceOfExileHiddenIsland } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { perilousMazeWateryLabyrinth } from "@lorcanito/lorcana-engine/cards/006";
// Import {
//   HeiheiExpandedConsciousness,
//   TeKaElementalTerror,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { mauiStubbornTrickster } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Maui - Stubborn Trickster", () => {
//   It("I'M NOT FINISHED YET When this character is banished, choose one:", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mauiStubbornTrickster.cost,
//       Play: [mauiStubbornTrickster],
//       Hand: [dragonFire],
//     });
//
//     Await testEngine.playCard(mauiStubbornTrickster);
//     Await testEngine.playCard(
//       DragonFire,
//       {
//         Targets: [mauiStubbornTrickster],
//       },
//       True,
//     );
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//   });
//
//   It("- Put 2 damage counters on all opposing characters.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mauiStubbornTrickster.cost,
//         Play: [mauiStubbornTrickster, moanChosenByTheOcean],
//         Hand: [dragonFire],
//       },
//       {
//         Play: [teKaElementalTerror, tamatoaSoShiny],
//       },
//     );
//
//     Await testEngine.playCard(
//       DragonFire,
//       {
//         Targets: [mauiStubbornTrickster],
//       },
//       True,
//     );
//
//     Await testEngine.resolveTopOfStack({ mode: "1" });
//
//     Expect(testEngine.getCardModel(teKaElementalTerror).damage).toEqual(2);
//     Expect(testEngine.getCardModel(tamatoaSoShiny).damage).toEqual(2);
//     Expect(testEngine.getCardModel(moanChosenByTheOcean).damage).toEqual(0);
//   });
//
//   It("- Put 2 damage counters on all opposing characters. RESIST", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mauiStubbornTrickster.cost,
//         Play: [mauiStubbornTrickster],
//         Hand: [dragonFire],
//       },
//       {
//         Play: [heiheiExpandedConsciousness],
//       },
//     );
//
//     Await testEngine.playCard(
//       DragonFire,
//       {
//         Targets: [mauiStubbornTrickster],
//       },
//       True,
//     );
//
//     Await testEngine.resolveTopOfStack({ mode: "1" });
//
//     Expect(
//       TestEngine.getCardModel(heiheiExpandedConsciousness).hasResist,
//     ).toBeTruthy();
//     Expect(testEngine.getCardModel(heiheiExpandedConsciousness).damage).toEqual(
//       2,
//     );
//   });
//
//   It("- Banish all opposing items.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mauiStubbornTrickster.cost,
//         Play: [mauiStubbornTrickster, mauisFishHook],
//         Hand: [dragonFire],
//       },
//       {
//         Play: [luckyDime, pawpsicle],
//       },
//     );
//
//     Await testEngine.playCard(mauiStubbornTrickster);
//     Await testEngine.playCard(
//       DragonFire,
//       {
//         Targets: [mauiStubbornTrickster],
//       },
//       True,
//     );
//
//     Await testEngine.resolveTopOfStack({ mode: "2" });
//
//     Expect(testEngine.getCardModel(luckyDime).zone).toEqual("discard");
//     Expect(testEngine.getCardModel(pawpsicle).zone).toEqual("discard");
//     Expect(testEngine.getCardModel(mauisFishHook).zone).toEqual("play");
//   });
//
//   It("- Banish all opposing locations.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mauiStubbornTrickster.cost,
//         Play: [mauiStubbornTrickster, mauisPlaceOfExileHiddenIsland],
//         Hand: [dragonFire],
//       },
//       {
//         Play: [hiddenCoveTranquilHaven, perilousMazeWateryLabyrinth],
//       },
//     );
//
//     Await testEngine.playCard(mauiStubbornTrickster);
//     Await testEngine.playCard(
//       DragonFire,
//       {
//         Targets: [mauiStubbornTrickster],
//       },
//       True,
//     );
//
//     Await testEngine.resolveTopOfStack({ mode: "3" });
//
//     Expect(testEngine.getCardModel(hiddenCoveTranquilHaven).zone).toEqual(
//       "discard",
//     );
//     Expect(testEngine.getCardModel(perilousMazeWateryLabyrinth).zone).toEqual(
//       "discard",
//     );
//     Expect(testEngine.getCardModel(mauisPlaceOfExileHiddenIsland).zone).toEqual(
//       "play",
//     );
//   });
// });
//
