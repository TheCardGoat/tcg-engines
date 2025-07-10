// import {
//   firstContact,
//   overflowingAffection,
// } from "@lorcanito/gundam-engine/cards/GD01/commands/commands";
// import { TestEngine } from "@lorcanito/gundam-engine/cards/mocks/TestEngine";
//
// describe("Overflowing Affection", () => {
//   it("Draw 2. Then, discard 1.", () => {
//     const testEngine = new TestEngine({
//       resource: overflowingAffection.level,
//       hand: [overflowingAffection, firstContact],
//       deck: 10,
//     });
//
//     testEngine.playCard(overflowingAffection);
//     testEngine.resolveTopOfStack([firstContact]);
//
//     expect(testEngine.getPlayerZones()?.hand).toHaveLength(2);
//     expect(testEngine.getCardZone(firstContact)).toBe("trash");
//     expect(testEngine.getCardZone(overflowingAffection)).toBe("trash");
//   });
// });
