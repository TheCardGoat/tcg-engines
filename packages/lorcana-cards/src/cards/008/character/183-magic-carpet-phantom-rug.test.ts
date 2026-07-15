// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { iagoGiantSpectralParrot } from "@lorcanito/lorcana-engine/cards/007";
// Import { magicCarpetPhantomRug } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Magic Carpet - Phantom Rug", () => {
//   It("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: magicCarpetPhantomRug.cost,
//       Play: [magicCarpetPhantomRug],
//       Hand: [],
//     });
//
//     Expect(testEngine.getCardModel(magicCarpetPhantomRug).hasVanish).toBe(true);
//   });
//
//   It("SPECTRAL FORCE Your other Illusion characters gain Challenger +1. (They get +1 {S} while challenging.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: magicCarpetPhantomRug.cost,
//       Play: [magicCarpetPhantomRug, iagoGiantSpectralParrot],
//       Hand: [],
//     });
//
//     Expect(testEngine.getCardModel(iagoGiantSpectralParrot).hasChallenger).toBe(
//       True,
//     );
//   });
// });
//
