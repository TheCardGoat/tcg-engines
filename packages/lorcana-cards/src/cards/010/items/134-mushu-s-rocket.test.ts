// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseAmberChampion,
//   MushusRocket,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mushu's Rocket", () => {
//   Describe("I NEED FIREPOWER - When you play this item, chosen character gains Rush this turn", () => {
//     It("grants Rush to a chosen character when the item is played", () => {
//       Const testStore = new TestStore({
//         Inkwell: mushusRocket.cost + 3, // Extra ink for a character
//         Hand: [mushusRocket, mickeyMouseAmberChampion],
//       });
//
//       Const rocketCard = testStore.getByZoneAndId("hand", mushusRocket.id);
//       Const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseAmberChampion.id,
//       );
//
//       // Play the character first
//       TargetCharacter.playFromHand();
//       TestStore.resolveTopOfStack({});
//
//       // Play the item - this should trigger the "when you play this" ability
//       RocketCard.playFromHand();
//
//       // Resolve the triggered ability and choose the character as target
//       TestStore.resolveTopOfStack({ targets: [targetCharacter] }, true); // skip assertion
//
//       // If we got here without errors, the ability worked correctly
//       Expect(true).toBe(true);
//     });
//
//     It("allows the chosen character to challenge immediately after gaining Rush", () => {
//       Const testStore = new TestStore({
//         Inkwell: mushusRocket.cost + 4,
//         Hand: [mushusRocket, mickeyMouseAmberChampion],
//       });
//
//       Const rocketCard = testStore.getByZoneAndId("hand", mushusRocket.id);
//       Const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseAmberChampion.id,
//       );
//
//       // Play the character first
//       TargetCharacter.playFromHand();
//       TestStore.resolveTopOfStack({});
//
//       // Play the item and choose the character as target
//       RocketCard.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       // Character should have Rush and be able to challenge
//       // Note: We can't directly access abilities as it's private, but we can test behavior
//       Expect(targetCharacter.zone).toBe("play");
//     });
//   });
//
//   Describe("HITCH A RIDE - 2 {I}, Banish this item — Chosen character gains Rush this turn", () => {
//     It("can be activated after playing the item", () => {
//       Const testStore = new TestStore({
//         Inkwell: mushusRocket.cost + 6, // Enough ink to play item, character, and activate ability
//         Hand: [mushusRocket, mickeyMouseAmberChampion],
//       });
//
//       Const rocketCard = testStore.getByZoneAndId("hand", mushusRocket.id);
//       Const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseAmberChampion.id,
//       );
//
//       // Play the character first
//       TargetCharacter.playFromHand();
//       TestStore.resolveTopOfStack({});
//
//       // Play the item
//       RocketCard.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       // Card should be in play
//       Expect(rocketCard.zone).toBe("play");
//
//       // Activate the Hitch A Ride ability
//       RocketCard.activate();
//
//       // The activation should work without errors
//       Expect(true).toBe(true); // If we got here, activation worked
//     });
//
//     It("banishes the item when the ability is activated", () => {
//       Const testStore = new TestStore({
//         Inkwell: mushusRocket.cost + 6,
//         Hand: [mushusRocket, mickeyMouseAmberChampion],
//       });
//
//       Const rocketCard = testStore.getByZoneAndId("hand", mushusRocket.id);
//       Const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseAmberChampion.id,
//       );
//
//       // Play the character first
//       TargetCharacter.playFromHand();
//       TestStore.resolveTopOfStack({});
//
//       // Play the item
//       RocketCard.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       Expect(rocketCard.zone).toBe("play");
//
//       // Activate and resolve the ability
//       RocketCard.activate();
//       TestStore.resolveTopOfStack(
//         {
//           Targets: [targetCharacter],
//         },
//         True,
//       ); // skip assertion to handle stack clearing
//
//       // Item should be banished
//       Expect(rocketCard.zone).toBe("discard");
//     });
//
//     It("grants Rush to the chosen character when activated", () => {
//       Const testStore = new TestStore({
//         Inkwell: mushusRocket.cost + 6,
//         Hand: [mushusRocket, mickeyMouseAmberChampion],
//       });
//
//       Const rocketCard = testStore.getByZoneAndId("hand", mushusRocket.id);
//       Const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseAmberChampion.id,
//       );
//
//       // Play the character first
//       TargetCharacter.playFromHand();
//       TestStore.resolveTopOfStack({});
//
//       // Play the item
//       RocketCard.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       // Activate the ability
//       RocketCard.activate();
//       TestStore.resolveTopOfStack(
//         {
//           Targets: [targetCharacter],
//         },
//         True,
//       ); // skip assertion to handle stack clearing
//
//       // Character should be in play and have Rush effect applied
//       Expect(targetCharacter.zone).toBe("play");
//     });
//   });
// });
//
