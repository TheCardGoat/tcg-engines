// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   flashRecordsSpecialist,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Flash - Records Specialist", () => {
//   it("HOLD... YOUR HORSES - This character enters play exerted", async () => {
//     const testEngine = new TestEngine({
//       inkwell: flashRecordsSpecialist.cost,
//       hand: [flashRecordsSpecialist],
//     });
//
//     const flash = testEngine.getCardModel(flashRecordsSpecialist);
//
//     await testEngine.playCard(flashRecordsSpecialist);
//
//     // Flash should enter play exerted
//     expect(flash.zone).toBe("play");
//     expect(flash.ready).toBe(false);
//   });
//
//   it("DEEP RESEARCH - Should give chosen Detective character +2 {S} this turn", async () => {
//     const testEngine = new TestEngine({
//       play: [flashRecordsSpecialist, mickeyMouseDetective],
//     });
//
//     const flash = testEngine.getCardModel(flashRecordsSpecialist);
//     const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//     // Make Flash ready so he can quest
//     flash.updateCardMeta({ exerted: false });
//
//     const mickeyOriginalStrength = mickey.strength;
//
//     // Quest with Flash
//     await testEngine.questCard(flashRecordsSpecialist);
//
//     // Accept the optional ability
//     await testEngine.acceptOptionalAbility();
//
//     // Choose Mickey as the target
//     await testEngine.resolveTopOfStack({ targets: [mickey] });
//
//     // Mickey should have +2 strength this turn
//     expect(mickey.strength).toBe(mickeyOriginalStrength + 2);
//   });
//
//   it("DEEP RESEARCH - Should be optional", async () => {
//     const testEngine = new TestEngine({
//       play: [flashRecordsSpecialist, mickeyMouseDetective],
//     });
//
//     const flash = testEngine.getCardModel(flashRecordsSpecialist);
//     const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//     // Make Flash ready so he can quest
//     flash.updateCardMeta({ exerted: false });
//
//     const mickeyOriginalStrength = mickey.strength;
//
//     // Quest with Flash
//     await testEngine.questCard(flashRecordsSpecialist);
//
//     // Decline the optional ability
//     await testEngine.skipTopOfStack();
//
//     // Mickey should still have his original strength
//     expect(mickey.strength).toBe(mickeyOriginalStrength);
//   });
//
//   it("DEEP RESEARCH - Should only target Detective characters", async () => {
//     const testEngine = new TestEngine({
//       play: [flashRecordsSpecialist, mickeyMouseDetective],
//     });
//
//     const flash = testEngine.getCardModel(flashRecordsSpecialist);
//
//     // Make Flash ready
//     flash.updateCardMeta({ exerted: false });
//
//     // Quest with Flash
//     await testEngine.questCard(flashRecordsSpecialist);
//     await testEngine.acceptOptionalAbility();
//
//     // Verify the ability has Detective filter
//     const topLayer = testEngine.store.stackLayerStore.topLayer;
//     expect(topLayer).toBeDefined();
//
//     if (topLayer?.ability?.effects) {
//       const effect = topLayer.ability.effects[0];
//       if (effect && effect.type === "attribute" && "target" in effect) {
//         const target = effect.target;
//         if (target && "filters" in target) {
//           const detectiveFilter = target.filters?.find(
//             (f: any) =>
//               f.filter === "characteristics" && f.value.includes("detective"),
//           );
//           expect(detectiveFilter).toBeDefined();
//         }
//       }
//     }
//   });
// });
//
