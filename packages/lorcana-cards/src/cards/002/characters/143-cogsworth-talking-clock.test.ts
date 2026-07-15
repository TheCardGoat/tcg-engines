// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CogsworthTalkingClock,
//   FeliciaAlwaysHungry,
//   TukTukWreckingBall,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cogsworth - Talking Clock", () => {
//   It("**WAIT A MINUTE** Your character with **Reckless** gain {E} − Gain 1 lore.", () => {
//     Const testStore = new TestStore({
//       Play: [cogsworthTalkingClock, feliciaAlwaysHungry, tukTukWreckingBall],
//     });
//
//     Const target = testStore.getByZoneAndId("play", feliciaAlwaysHungry.id);
//     Const target2 = testStore.getByZoneAndId("play", tukTukWreckingBall.id);
//
//     Expect(testStore.getPlayerLore()).toEqual(0);
//
//     Expect(target.ready).toEqual(true);
//     Expect(target.hasActivatedAbility).toEqual(true);
//
//     Target.activate();
//
//     Expect(target.ready).toEqual(false);
//     Expect(testStore.getPlayerLore()).toEqual(1);
//
//     Expect(target2.ready).toEqual(true);
//     Expect(target2.hasActivatedAbility).toEqual(true);
//
//     Target2.activate();
//
//     Expect(target2.ready).toEqual(false);
//     Expect(testStore.getPlayerLore()).toEqual(2);
//   });
// });
//
