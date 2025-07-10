// import { theWitchAndTheBride } from "@lorcanito/gundam-engine/cards/GD01/commands/commands";
// import { unicornGundamRx0 } from "@lorcanito/gundam-engine/cards/GD01/units/units";
// import { TestEngine } from "@lorcanito/gundam-engine/cards/mocks/TestEngine";
//
// describe("The Witch and the Bride", () => {
//   it("Choose 1 enemy Unit with 5 or less HP. Return it to its onwer's hand.", () => {
//     const testEngine = new TestEngine(
//       {
//         resource: theWitchAndTheBride.level,
//         hand: [theWitchAndTheBride],
//       },
//       {
//         battle: [unicornGundamRx0],
//       },
//     );
//
//     testEngine.playCard(theWitchAndTheBride);
//
//     expect(testEngine.getCardZone(unicornGundamRx0)).toBe("battle");
//     testEngine.resolveTopOfStack([unicornGundamRx0]);
//     expect(testEngine.getCardZone(unicornGundamRx0)).toBe("hand");
//   });
// });
