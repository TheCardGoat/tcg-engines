// import { TestEngine } from "@lorcanito/gundam-engine/cards/mocks/TestEngine";
// import { kaisResolveKaiShiden } from "@lorcanito/gundam-engine/cards/ST01/commands/commands";
// import { gundamRx782 } from "@lorcanito/gundam-engine/cards/ST01/units/units";
//
// describe("kaisResolveKaiShiden", () => {
//   it("**Main** Choose 1 friendly Unit. It recovers 3 HP.", () => {
//     const testEngine = new TestEngine({
//       resource: kaisResolveKaiShiden.level,
//       hand: [kaisResolveKaiShiden],
//       battle: [gundamRx782],
//       deck: 10,
//     });
//
//     testEngine.playCard(kaisResolveKaiShiden);
//     testEngine.resolveTopOfStack([gundamRx782]);
//     expect(testEngine.getCardMetaData(gundamRx782)?.damage).toBe(0);
//   });
// });
