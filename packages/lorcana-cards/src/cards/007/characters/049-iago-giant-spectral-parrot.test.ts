import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { iagoGiantSpectralParrot } from "./049-iago-giant-spectral-parrot";

describe("Iago - Giant Spectral Parrot", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [iagoGiantSpectralParrot],
    });

    const cardUnderTest = testEngine.getCardModel(iagoGiantSpectralParrot);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("should have Vanish ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [iagoGiantSpectralParrot],
    });

    const cardUnderTest = testEngine.getCardModel(iagoGiantSpectralParrot);
    expect(cardUnderTest.hasVanish).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { andThenAlongCameZeus } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { iagoGiantSpectralParrot } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { theLibraryAGiftForBelle } from "../../005/locations/068-the-library-a-gift-for-belle";
// import { deweyLovableShowoff } from "../../008";
// import { intoTheUnknown } from "../../008/action/081-into-the-unknown";
//
// describe("Iago - Giant Spectral Parrot", () => {
//   it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [iagoGiantSpectralParrot],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(iagoGiantSpectralParrot);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
//     const testEngine = new TestEngine({
//       play: [iagoGiantSpectralParrot],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(iagoGiantSpectralParrot);
//     expect(cardUnderTest.hasVanish).toBe(true);
//   });
// });
//
// describe("Regression", () => {
//   it("should vanish when hitted by and the came along zeus", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: andThenAlongCameZeus.cost,
//         hand: [andThenAlongCameZeus],
//       },
//       {
//         play: [iagoGiantSpectralParrot],
//       },
//     );
//
//     await testEngine.playCard(andThenAlongCameZeus, {
//       targets: [iagoGiantSpectralParrot],
//     });
//
//     expect(testEngine.getCardModel(iagoGiantSpectralParrot).zone).toBe(
//       "discard",
//     );
//   });
//
//   it("when use Into the unknown, and iago is in location The Library, library owner don't draw a card and iago goes to the inkwell", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: 1,
//         play: [
//           iagoGiantSpectralParrot,
//           deweyLovableShowoff,
//           theLibraryAGiftForBelle,
//         ],
//       },
//       {
//         inkwell: intoTheUnknown.cost,
//         hand: [intoTheUnknown],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(iagoGiantSpectralParrot);
//     const libraryOwner = testEngine.getCardModel(theLibraryAGiftForBelle);
//     const intoTheUnknownCard = testEngine.getCardModel(intoTheUnknown);
//
//     await testEngine.moveToLocation({
//       location: libraryOwner,
//       character: cardUnderTest,
//     });
//
//     cardUnderTest.exert();
//
//     expect(cardUnderTest.isAtLocation(libraryOwner)).toBe(true);
//     expect(testEngine.getCardsByZone("hand")).toHaveLength(0);
//     expect(testEngine.getCardsByZone("inkwell")).toHaveLength(1);
//
//     await testEngine.passTurn();
//
//     await testEngine.playCard(intoTheUnknownCard);
//     console.log("----- Risolvo 1 -----", await testEngine.stackLayers[0]?.name);
//     console.log(
//       "----- Stack -----",
//       await testEngine.stackLayers.map((layer) => layer.name),
//     );
//     console.log("----- FINE STACK -----");
//     await testEngine.resolveTopOfStack({
//       targets: [cardUnderTest],
//     });
//     console.log("----- Risolvo 2 -----");
//     /*await testEngine.resolveTopOfStack({
//       targets: [cardUnderTest],
//     });
//     console.log("----- Risolvo 3 -----");
//     await testEngine.resolveOptionalAbility();
// */
//     expect(cardUnderTest.zone).toBe("inkwell");
//     expect(testEngine.getCardsByZone("hand")).toHaveLength(0);
//
//     // expect(cardUnderTest.zone).toBe("discard");
//   });
// });
//
