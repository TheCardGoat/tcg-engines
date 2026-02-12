// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielSingingMermaid,
//   MirabelMadrigalProphecyFinder,
//   PhiloctetesNoNonsenseInstructor,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Philoctetes - No-Nonsense Instructor", () => {
//   It("**YOU GOTTA STAY FOCUSED** Your Hero characters gain **Challenger** +1. _(They get +1 {S} while challenging.)", () => {
//     Const testStore = new TestStore({
//       Play: [philoctetesNoNonsenseInstructor, arielSingingMermaid],
//     });
//     Const target = testStore.getByZoneAndId("play", arielSingingMermaid.id);
//
//     Expect(target.hasChallenger).toBe(true);
//     Expect(target.challengerBonus).toBe(1);
//   });
//
//   It("**SHAMELESS PROMOTER** Whenever you play a Hero character, gain 1 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mirabelMadrigalProphecyFinder.cost,
//       Hand: [mirabelMadrigalProphecyFinder],
//       Play: [philoctetesNoNonsenseInstructor],
//     });
//     Const cardInHand = testStore.getCard(mirabelMadrigalProphecyFinder);
//
//     CardInHand.playFromHand();
//
//     Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
//   });
// });
//
