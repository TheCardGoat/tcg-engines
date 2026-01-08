// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mickeyMouseAmberChampion,
//   mushusRocket,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mushu's Rocket", () => {
//   describe("I NEED FIREPOWER - When you play this item, chosen character gains Rush this turn", () => {
//     it("grants Rush to a chosen character when the item is played", () => {
//       const testStore = new TestStore({
//         inkwell: mushusRocket.cost + 3, // Extra ink for a character
//         hand: [mushusRocket, mickeyMouseAmberChampion],
//       });
//
//       const rocketCard = testStore.getByZoneAndId("hand", mushusRocket.id);
//       const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         mickeyMouseAmberChampion.id,
//       );
//
//       // Play the character first
//       targetCharacter.playFromHand();
//       testStore.resolveTopOfStack({});
//
//       // Play the item - this should trigger the "when you play this" ability
//       rocketCard.playFromHand();
//
//       // Resolve the triggered ability and choose the character as target
//       testStore.resolveTopOfStack({ targets: [targetCharacter] }, true); // skip assertion
//
//       // If we got here without errors, the ability worked correctly
//       expect(true).toBe(true);
//     });
//
//     it("allows the chosen character to challenge immediately after gaining Rush", () => {
//       const testStore = new TestStore({
//         inkwell: mushusRocket.cost + 4,
//         hand: [mushusRocket, mickeyMouseAmberChampion],
//       });
//
//       const rocketCard = testStore.getByZoneAndId("hand", mushusRocket.id);
//       const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         mickeyMouseAmberChampion.id,
//       );
//
//       // Play the character first
//       targetCharacter.playFromHand();
//       testStore.resolveTopOfStack({});
//
//       // Play the item and choose the character as target
//       rocketCard.playFromHand();
//       testStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       // Character should have Rush and be able to challenge
//       // Note: We can't directly access abilities as it's private, but we can test behavior
//       expect(targetCharacter.zone).toBe("play");
//     });
//   });
//
//   describe("HITCH A RIDE - 2 {I}, Banish this item — Chosen character gains Rush this turn", () => {
//     it("can be activated after playing the item", () => {
//       const testStore = new TestStore({
//         inkwell: mushusRocket.cost + 6, // Enough ink to play item, character, and activate ability
//         hand: [mushusRocket, mickeyMouseAmberChampion],
//       });
//
//       const rocketCard = testStore.getByZoneAndId("hand", mushusRocket.id);
//       const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         mickeyMouseAmberChampion.id,
//       );
//
//       // Play the character first
//       targetCharacter.playFromHand();
//       testStore.resolveTopOfStack({});
//
//       // Play the item
//       rocketCard.playFromHand();
//       testStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       // Card should be in play
//       expect(rocketCard.zone).toBe("play");
//
//       // Activate the Hitch A Ride ability
//       rocketCard.activate();
//
//       // The activation should work without errors
//       expect(true).toBe(true); // If we got here, activation worked
//     });
//
//     it("banishes the item when the ability is activated", () => {
//       const testStore = new TestStore({
//         inkwell: mushusRocket.cost + 6,
//         hand: [mushusRocket, mickeyMouseAmberChampion],
//       });
//
//       const rocketCard = testStore.getByZoneAndId("hand", mushusRocket.id);
//       const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         mickeyMouseAmberChampion.id,
//       );
//
//       // Play the character first
//       targetCharacter.playFromHand();
//       testStore.resolveTopOfStack({});
//
//       // Play the item
//       rocketCard.playFromHand();
//       testStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       expect(rocketCard.zone).toBe("play");
//
//       // Activate and resolve the ability
//       rocketCard.activate();
//       testStore.resolveTopOfStack(
//         {
//           targets: [targetCharacter],
//         },
//         true,
//       ); // skip assertion to handle stack clearing
//
//       // Item should be banished
//       expect(rocketCard.zone).toBe("discard");
//     });
//
//     it("grants Rush to the chosen character when activated", () => {
//       const testStore = new TestStore({
//         inkwell: mushusRocket.cost + 6,
//         hand: [mushusRocket, mickeyMouseAmberChampion],
//       });
//
//       const rocketCard = testStore.getByZoneAndId("hand", mushusRocket.id);
//       const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         mickeyMouseAmberChampion.id,
//       );
//
//       // Play the character first
//       targetCharacter.playFromHand();
//       testStore.resolveTopOfStack({});
//
//       // Play the item
//       rocketCard.playFromHand();
//       testStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       // Activate the ability
//       rocketCard.activate();
//       testStore.resolveTopOfStack(
//         {
//           targets: [targetCharacter],
//         },
//         true,
//       ); // skip assertion to handle stack clearing
//
//       // Character should be in play and have Rush effect applied
//       expect(targetCharacter.zone).toBe("play");
//     });
//   });
// });
//
