// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoonsMaleficent,
//   IagoLoudMouthedParrot,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
// Import { rapunzelGiftedArtist } from "../../002/characters/characters";
// Import { rapunzelsTowerSecludedPrison } from "../../005/locations/locations";
// Import { motherGothelVainSorceress } from "./064-mother-gothel-vain-sorceress";
//
// Describe("Mother Gothel - Vain Sorceress", () => {
//   Describe("NOW YOU'VE UPSET ME - When one of your characters challenges, you may move 1 damage counter from chosen character to chosen opposing character.", () => {
//     It("should move 1 damage counter from chosen character to chosen opposing character when ability is accepted", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [motherGothelVainSorceress, rapunzelGiftedArtist],
//         },
//         {
//           Play: [goonsMaleficent],
//         },
//       );
//
//       Const gothel = testStore.getByZoneAndId(
//         "play",
//         MotherGothelVainSorceress.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         GoonsMaleficent.id,
//         "player_two",
//       );
//       Const rapunzel = testStore.getByZoneAndId(
//         "play",
//         RapunzelGiftedArtist.id,
//       );
//
//       // Set up initial state
//       Rapunzel.updateCardMeta({ damage: 2 });
//       Target.updateCardMeta({ exerted: true, damage: 0 });
//
//       // Challenge to trigger the ability
//       TestStore.store.challenge(rapunzel.instanceId, target.instanceId);
//
//       // Accept the optional ability
//       TestStore.resolveTopOfStack({}, true);
//
//       // Choose source character (where to take damage from)
//       TestStore.resolveTopOfStack({ targets: [rapunzel] }, true);
//
//       // Choose target character (where to move damage to)
//       TestStore.resolveTopOfStack({ targets: [target] }, true);
//
//       // Verify the damage was moved correctly
//       Expect(rapunzel.meta.damage).toBe(1);
//       Expect(target.meta.damage).toBe(1);
//     });
//
//     It("should not move damage when ability is declined", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [motherGothelVainSorceress, rapunzelGiftedArtist],
//         },
//         {
//           Play: [goonsMaleficent],
//         },
//       );
//
//       Const gothel = testStore.getByZoneAndId(
//         "play",
//         MotherGothelVainSorceress.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         GoonsMaleficent.id,
//         "player_two",
//       );
//       Const rapunzel = testStore.getByZoneAndId(
//         "play",
//         RapunzelGiftedArtist.id,
//       );
//
//       // Set up initial state
//       Rapunzel.updateCardMeta({ damage: 2 });
//       Target.updateCardMeta({ exerted: true, damage: 0 });
//
//       // Challenge to trigger the ability
//       TestStore.store.challenge(rapunzel.instanceId, target.instanceId);
//
//       // Decline the optional ability
//       TestStore.resolveTopOfStack({ skip: true }, true);
//
//       // Verify no damage was moved
//       Expect(rapunzel.meta.damage).toBe(2);
//       Expect(target.meta.damage).toBe(0);
//     });
//
//     It("should move 1 damage counter from chosen character to chosen opposing character when challenging a location", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [motherGothelVainSorceress, rapunzelGiftedArtist],
//         },
//         {
//           Play: [rapunzelsTowerSecludedPrison, goonsMaleficent],
//         },
//       );
//
//       Const gothel = testStore.getByZoneAndId(
//         "play",
//         MotherGothelVainSorceress.id,
//       );
//       Const tower = testStore.getByZoneAndId(
//         "play",
//         RapunzelsTowerSecludedPrison.id,
//         "player_two",
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         GoonsMaleficent.id,
//         "player_two",
//       );
//       Const rapunzel = testStore.getByZoneAndId(
//         "play",
//         RapunzelGiftedArtist.id,
//       );
//
//       // Set up initial state
//       Rapunzel.updateCardMeta({ damage: 2 });
//       Tower.updateCardMeta({ damage: 0 });
//       Target.updateCardMeta({ exerted: true, damage: 0 });
//
//       // Challenge to trigger the ability
//       TestStore.store.challenge(gothel.instanceId, tower.instanceId);
//
//       // Accept the optional ability
//       TestStore.resolveTopOfStack({}, true);
//
//       // Choose source character (where to take damage from)
//       TestStore.resolveTopOfStack({ targets: [rapunzel] }, true);
//
//       // Choose target character (where to move damage to)
//       TestStore.resolveTopOfStack({ targets: [target] }, true);
//
//       // Verify the damage was moved correctly
//       Expect(rapunzel.meta.damage).toBe(1);
//       Expect(target.meta.damage).toBe(1);
//     });
//   });
//
//   Describe("Regression", () => {
//     It("moves damage before challenge is resolved", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [motherGothelVainSorceress],
//         },
//         {
//           Play: [goonsMaleficent],
//         },
//       );
//
//       Await testEngine.tapCard(goonsMaleficent);
//       Await testEngine.setCardDamage(
//         GoonsMaleficent,
//         GoonsMaleficent.willpower - 1,
//       );
//       Await testEngine.setCardDamage(
//         MotherGothelVainSorceress,
//         MotherGothelVainSorceress.willpower - 1,
//       );
//
//       Await testEngine.challenge({
//         Attacker: motherGothelVainSorceress,
//         Defender: goonsMaleficent,
//       });
//
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [motherGothelVainSorceress],
//         },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Targets: [goonsMaleficent],
//       });
//
//       Expect(testEngine.getCardModel(motherGothelVainSorceress).zone).toBe(
//         "play",
//       );
//       Expect(testEngine.getCardModel(motherGothelVainSorceress).damage).toBe(
//         MotherGothelVainSorceress.willpower - 2, // She moved 1 damage to Maleficent
//       );
//       Expect(testEngine.getCardModel(goonsMaleficent).zone).toBe("discard");
//     });
//
//     It("It cannot move damage caused during combat", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [motherGothelVainSorceress, iagoLoudMouthedParrot],
//         },
//         {
//           Play: [goonsMaleficent],
//         },
//       );
//
//       Await testEngine.tapCard(goonsMaleficent);
//
//       Await testEngine.challenge({
//         Attacker: iagoLoudMouthedParrot,
//         Defender: goonsMaleficent,
//       });
//
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [iagoLoudMouthedParrot],
//         },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Targets: [goonsMaleficent],
//       });
//
//       // Damage can only be moved before the combat, so the damage caused during combat must remain
//       Expect(testEngine.getCardModel(iagoLoudMouthedParrot).damage).toBe(
//         GoonsMaleficent.strength,
//       );
//       Expect(testEngine.getCardModel(goonsMaleficent).damage).toBe(
//         IagoLoudMouthedParrot.strength,
//       );
//     });
//   });
// });
//
