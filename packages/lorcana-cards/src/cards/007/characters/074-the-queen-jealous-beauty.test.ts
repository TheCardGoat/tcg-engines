// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DiabloSpitefulRaven,
//   DoloresMadrigalWithinEarshot,
//   JasmineInspiredResearcher,
//   MerlinCleverClairvoyant,
//   RayaGuidanceSeeker,
//   TheQueenJealousBeauty,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Queen - Jealous Beauty", () => {
//   Describe("NOT AN ORDINARY APPLE {E} - Choose 3 cards in an opponent's discard and put them under their deck to gain 3 lore. If you moved at least 1 Princess this way, gain 4 lore instead.", () => {
//     It("Moving a princess", async () => {
//       Const targets = [
//         JasmineInspiredResearcher,
//         RayaGuidanceSeeker,
//         DiabloSpitefulRaven,
//       ];
//       Const testEngine = new TestEngine(
//         {
//           Play: [theQueenJealousBeauty],
//         },
//         {
//           Discard: targets,
//         },
//       );
//
//       Await testEngine.activateCard(theQueenJealousBeauty, {
//         Targets: targets,
//       });
//
//       Expect(testEngine.getLoreForPlayer()).toEqual(4);
//     });
//
//     It("NOT Moving a princess", async () => {
//       Const targets = [
//         DoloresMadrigalWithinEarshot,
//         MerlinCleverClairvoyant,
//         DiabloSpitefulRaven,
//       ];
//       Const testEngine = new TestEngine(
//         {
//           Play: [theQueenJealousBeauty],
//         },
//         {
//           Discard: targets,
//         },
//       );
//
//       Await testEngine.activateCard(theQueenJealousBeauty, {
//         Targets: targets,
//       });
//
//       For (const target of targets) {
//         Expect(testEngine.getCardModel(target).zone).toBe("deck");
//       }
//
//       Expect(testEngine.getLoreForPlayer()).toEqual(3);
//     });
//   });
// });
//
