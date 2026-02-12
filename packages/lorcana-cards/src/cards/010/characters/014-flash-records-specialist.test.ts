// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FlashRecordsSpecialist,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Flash - Records Specialist", () => {
//   It("HOLD... YOUR HORSES - This character enters play exerted", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: flashRecordsSpecialist.cost,
//       Hand: [flashRecordsSpecialist],
//     });
//
//     Const flash = testEngine.getCardModel(flashRecordsSpecialist);
//
//     Await testEngine.playCard(flashRecordsSpecialist);
//
//     // Flash should enter play exerted
//     Expect(flash.zone).toBe("play");
//     Expect(flash.ready).toBe(false);
//   });
//
//   It("DEEP RESEARCH - Should give chosen Detective character +2 {S} this turn", async () => {
//     Const testEngine = new TestEngine({
//       Play: [flashRecordsSpecialist, mickeyMouseDetective],
//     });
//
//     Const flash = testEngine.getCardModel(flashRecordsSpecialist);
//     Const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//     // Make Flash ready so he can quest
//     Flash.updateCardMeta({ exerted: false });
//
//     Const mickeyOriginalStrength = mickey.strength;
//
//     // Quest with Flash
//     Await testEngine.questCard(flashRecordsSpecialist);
//
//     // Accept the optional ability
//     Await testEngine.acceptOptionalAbility();
//
//     // Choose Mickey as the target
//     Await testEngine.resolveTopOfStack({ targets: [mickey] });
//
//     // Mickey should have +2 strength this turn
//     Expect(mickey.strength).toBe(mickeyOriginalStrength + 2);
//   });
//
//   It("DEEP RESEARCH - Should be optional", async () => {
//     Const testEngine = new TestEngine({
//       Play: [flashRecordsSpecialist, mickeyMouseDetective],
//     });
//
//     Const flash = testEngine.getCardModel(flashRecordsSpecialist);
//     Const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//     // Make Flash ready so he can quest
//     Flash.updateCardMeta({ exerted: false });
//
//     Const mickeyOriginalStrength = mickey.strength;
//
//     // Quest with Flash
//     Await testEngine.questCard(flashRecordsSpecialist);
//
//     // Decline the optional ability
//     Await testEngine.skipTopOfStack();
//
//     // Mickey should still have his original strength
//     Expect(mickey.strength).toBe(mickeyOriginalStrength);
//   });
//
//   It("DEEP RESEARCH - Should only target Detective characters", async () => {
//     Const testEngine = new TestEngine({
//       Play: [flashRecordsSpecialist, mickeyMouseDetective],
//     });
//
//     Const flash = testEngine.getCardModel(flashRecordsSpecialist);
//
//     // Make Flash ready
//     Flash.updateCardMeta({ exerted: false });
//
//     // Quest with Flash
//     Await testEngine.questCard(flashRecordsSpecialist);
//     Await testEngine.acceptOptionalAbility();
//
//     // Verify the ability has Detective filter
//     Const topLayer = testEngine.store.stackLayerStore.topLayer;
//     Expect(topLayer).toBeDefined();
//
//     If (topLayer?.ability?.effects) {
//       Const effect = topLayer.ability.effects[0];
//       If (effect && effect.type === "attribute" && "target" in effect) {
//         Const target = effect.target;
//         If (target && "filters" in target) {
//           Const detectiveFilter = target.filters?.find(
//             (f: any) =>
//               F.filter === "characteristics" && f.value.includes("detective"),
//           );
//           Expect(detectiveFilter).toBeDefined();
//         }
//       }
//     }
//   });
// });
//
