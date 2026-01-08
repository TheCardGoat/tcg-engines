import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { thunderboltWonderDog } from "./023-thunderbolt-wonder-dog";

describe("Thunderbolt - Wonder Dog", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [thunderboltWonderDog],
    });

    const cardUnderTest = testEngine.getCardModel(thunderboltWonderDog);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [thunderboltWonderDog],
    });

    const cardUnderTest = testEngine.getCardModel(thunderboltWonderDog);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { princeJohnGreediestOfAll } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { rollyHungryPup } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { thunderboltWonderDog } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Puppy Shift 3 (You may pay 3 {I} to play this on top of one of your Puppy characters.)", () => {
//   it("should shift in a Puppy character", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [rollyHungryPup],
//       hand: [thunderboltWonderDog],
//     });
//
//     const shiftedCard = testEngine.getCardModel(rollyHungryPup);
//     const shiftCard = testEngine.getCardModel(thunderboltWonderDog);
//
//     expect(shiftCard.canShiftInto(shiftedCard)).toBe(true);
//
//     shiftCard.shift(shiftedCard);
//
//     expect(shiftCard.zone).toBe("play");
//     expect(shiftedCard.zone).toBe("play");
//     expect(shiftedCard.meta?.shifter).toBe(shiftCard.instanceId);
//     expect(shiftCard.meta?.shifted).toBe(shiftedCard.instanceId);
//   });
//   it("should not shift in a non-Puppy character", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [princeJohnGreediestOfAll],
//       hand: [thunderboltWonderDog],
//     });
//
//     const shiftedCard = testEngine.getCardModel(princeJohnGreediestOfAll);
//     const shiftCard = testEngine.getCardModel(thunderboltWonderDog);
//
//     expect(shiftCard.canShiftInto(shiftedCard)).toBe(false);
//
//     shiftCard.shift(shiftedCard);
//
//     expect(shiftCard.zone).toBe("hand");
//     expect(shiftedCard.zone).toBe("play");
//   });
// });
//
