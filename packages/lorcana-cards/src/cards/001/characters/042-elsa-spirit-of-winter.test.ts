import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { elsaSpiritOfWinter } from "./042-elsa-spirit-of-winter";

describe("Elsa - Spirit of Winter", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [elsaSpiritOfWinter] });
  //   Expect(testEngine.getCardModel(elsaSpiritOfWinter).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ElsaSpiritOfWinter,
//   JohnSilverAlienPirate,
//   PascalRapunzelCompanion,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Export function elsaSpiritOfWinterTargetingOneCharacterTestCase() {
//   Const testStore = new TestStore(
//     {
//       Deck: 3,
//       Inkwell: elsaSpiritOfWinter.cost,
//       Hand: [elsaSpiritOfWinter],
//     },
//     {
//       Deck: 3,
//       Play: [pascalRapunzelCompanion],
//     },
//   );
//
//   Const cardUnderTest = testStore.getByZoneAndId("hand", elsaSpiritOfWinter.id);
//   Const target = testStore.getByZoneAndId(
//     "play",
//     PascalRapunzelCompanion.id,
//     "player_two",
//   );
//
//   CardUnderTest.playFromHand();
//   TestStore.resolveOptionalAbility();
//   TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//   Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//
//   // Characters are exerted on first player turn
//   Expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));
//   TestStore.passTurn();
//
//   // Character does not ready on their turn
//   Expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));
//
//   // Characters are still exerted on first player next  turn
//   TestStore.passTurn();
//   Expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));
//
//   // Characters are ready on opponents second turn
//   TestStore.passTurn();
//   Expect(target.meta).toEqual(expect.objectContaining({ exerted: false }));
// }
//
// Describe("Elsa - Spirit of Winter", () => {
//   Describe("DEEP FREEZE - When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.", () => {
//     It("exert 1 chosen characters", () => {
//       ElsaSpiritOfWinterTargetingOneCharacterTestCase();
//     });
//
//     It("exert 2 chosen characters", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: elsaSpiritOfWinter.cost,
//           Hand: [elsaSpiritOfWinter],
//           Deck: 3,
//         },
//         {
//           Deck: 3,
//           Play: [pascalRapunzelCompanion, johnSilverAlienPirate],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         ElsaSpiritOfWinter.id,
//       );
//       Const targetOne = testStore.getByZoneAndId(
//         "play",
//         PascalRapunzelCompanion.id,
//         "player_two",
//       );
//       Const targetTwo = testStore.getByZoneAndId(
//         "play",
//         JohnSilverAlienPirate.id,
//         "player_two",
//       );
//
//       Const targets = [targetOne, targetTwo];
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [targetOne, targetTwo] });
//
//       // Characters are exerted on first player turn
//       Targets.forEach((target) => {
//         Expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));
//       });
//
//       TestStore.passTurn();
//
//       // Character does not ready on their turn
//       Targets.forEach((target) => {
//         Expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));
//       });
//
//       // Characters are still exerted on first player next  turn
//       TestStore.passTurn();
//       Targets.forEach((target) => {
//         Expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));
//       });
//
//       // Characters are ready on opponents second turn
//       TestStore.passTurn();
//       Targets.forEach((target) => {
//         Expect(target.meta).toEqual(
//           Expect.objectContaining({ exerted: false }),
//         );
//       });
//     });
//   });
// });
//
