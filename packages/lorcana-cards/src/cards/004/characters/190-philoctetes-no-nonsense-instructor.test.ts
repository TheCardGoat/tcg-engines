// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   arielSingingMermaid,
//   mirabelMadrigalProphecyFinder,
//   philoctetesNoNonsenseInstructor,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Philoctetes - No-Nonsense Instructor", () => {
//   it("**YOU GOTTA STAY FOCUSED** Your Hero characters gain **Challenger** +1. _(They get +1 {S} while challenging.)", () => {
//     const testStore = new TestStore({
//       play: [philoctetesNoNonsenseInstructor, arielSingingMermaid],
//     });
//     const target = testStore.getByZoneAndId("play", arielSingingMermaid.id);
//
//     expect(target.hasChallenger).toBe(true);
//     expect(target.challengerBonus).toBe(1);
//   });
//
//   it("**SHAMELESS PROMOTER** Whenever you play a Hero character, gain 1 lore.", () => {
//     const testStore = new TestStore({
//       inkwell: mirabelMadrigalProphecyFinder.cost,
//       hand: [mirabelMadrigalProphecyFinder],
//       play: [philoctetesNoNonsenseInstructor],
//     });
//     const cardInHand = testStore.getCard(mirabelMadrigalProphecyFinder);
//
//     cardInHand.playFromHand();
//
//     expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
//   });
// });
//
