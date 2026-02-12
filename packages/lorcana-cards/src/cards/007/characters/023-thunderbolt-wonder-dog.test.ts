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
// Import { describe, expect, it } from "@jest/globals";
// Import { princeJohnGreediestOfAll } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { rollyHungryPup } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { thunderboltWonderDog } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Puppy Shift 3 (You may pay 3 {I} to play this on top of one of your Puppy characters.)", () => {
//   It("should shift in a Puppy character", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [rollyHungryPup],
//       Hand: [thunderboltWonderDog],
//     });
//
//     Const shiftedCard = testEngine.getCardModel(rollyHungryPup);
//     Const shiftCard = testEngine.getCardModel(thunderboltWonderDog);
//
//     Expect(shiftCard.canShiftInto(shiftedCard)).toBe(true);
//
//     ShiftCard.shift(shiftedCard);
//
//     Expect(shiftCard.zone).toBe("play");
//     Expect(shiftedCard.zone).toBe("play");
//     Expect(shiftedCard.meta?.shifter).toBe(shiftCard.instanceId);
//     Expect(shiftCard.meta?.shifted).toBe(shiftedCard.instanceId);
//   });
//   It("should not shift in a non-Puppy character", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [princeJohnGreediestOfAll],
//       Hand: [thunderboltWonderDog],
//     });
//
//     Const shiftedCard = testEngine.getCardModel(princeJohnGreediestOfAll);
//     Const shiftCard = testEngine.getCardModel(thunderboltWonderDog);
//
//     Expect(shiftCard.canShiftInto(shiftedCard)).toBe(false);
//
//     ShiftCard.shift(shiftedCard);
//
//     Expect(shiftCard.zone).toBe("hand");
//     Expect(shiftedCard.zone).toBe("play");
//   });
// });
//
