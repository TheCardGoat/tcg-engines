// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { nickWildeWilyFox } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Nick Wilde - Wily Fox", () => {
//   Describe("**IT'S CALLED A HUSTLE** When you play this character, you may return an item card named Pawpsicle from your discard to your hand.", () => {
//     It("should return Pawpsicle from discard to hand", () => {
//       Const testStore = new TestStore({
//         Inkwell: nickWildeWilyFox.cost,
//         Hand: [nickWildeWilyFox],
//         Discard: [pawpsicle],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         NickWildeWilyFox.id,
//       );
//       Const target = testStore.getByZoneAndId("discard", pawpsicle.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("hand");
//     });
//
//     It("should NOT return any item from discard to hand", () => {
//       Const testStore = new TestStore({
//         Inkwell: nickWildeWilyFox.cost,
//         Hand: [nickWildeWilyFox],
//         Discard: [dingleHopper],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         NickWildeWilyFox.id,
//       );
//       Const target = testStore.getByZoneAndId("discard", dingleHopper.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       // At this point the engine will realise there's no valid target and won't add the ability to the stack
//       // testStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("discard");
//     });
//   });
// });
//
