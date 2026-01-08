// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   heHurledHisThunderbolt,
//   mickeyMouseDetective,
//   scroogeMcduckShushAgent,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Scrooge McDuck - S.H.U.S.H. Agent", () => {
//   it("Character should have correct base stats", async () => {
//     const testEngine = new TestEngine({
//       hand: [scroogeMcduckShushAgent],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       scroogeMcduckShushAgent.id,
//     );
//
//     // Check base stats
//     expect(cardUnderTest.cost).toBe(2);
//     expect(cardUnderTest.strength).toBe(0);
//     expect(cardUnderTest.willpower).toBe(2);
//     expect(cardUnderTest.lore).toBe(2);
//     expect(cardUnderTest.characteristics).toEqual(["storyborn", "hero"]);
//   });
//
//   it("Character can be played with correct cost", async () => {
//     const testEngine = new TestEngine({
//       inkwell: scroogeMcduckShushAgent.cost,
//       hand: [scroogeMcduckShushAgent],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       scroogeMcduckShushAgent.id,
//     );
//
//     await testEngine.playCard(cardUnderTest);
//     const scroogeInPlay = testEngine.getByZoneAndId(
//       "play",
//       scroogeMcduckShushAgent.id,
//     );
//     expect(scroogeInPlay.zone).toBe("play");
//   });
//
//   it("BACKUP PLAN - Should trigger draw effect when played", async () => {
//     const testEngine = new TestEngine({
//       inkwell: scroogeMcduckShushAgent.cost,
//       hand: [scroogeMcduckShushAgent],
//       deck: [mickeyMouseDetective],
//     });
//
//     // Initial hand count should be 1 (Scrooge)
//     expect(testEngine.getZonesCardCount().hand).toBe(1);
//
//     // Play Scrooge
//     await testEngine.playCard(scroogeMcduckShushAgent);
//
//     // The draw effect should trigger, making hand count at least 1
//     // (the discard effect may or may not be resolved automatically)
//     expect(testEngine.getZonesCardCount().hand).toBeGreaterThanOrEqual(1);
//
//     // Resolve top of the stack to trigger discard effect
//     const discardTarget = testEngine.getCardModel(mickeyMouseDetective);
//     await testEngine.resolveTopOfStack({ targets: [discardTarget] });
//
//     // Verify no card in hand and 1 card in discard
//     expect(testEngine.getZonesCardCount().hand).toBe(0);
//     expect(testEngine.getZonesCardCount().discard).toBe(1);
//   });
//
//   it("ON THE MOVE - Should return to hand when challenged", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [mickeyMouseDetective],
//       },
//       {
//         play: [scroogeMcduckShushAgent],
//       },
//     );
//
//     const attackerModel = testEngine.getCardModel(mickeyMouseDetective);
//     const defenderModel = testEngine.getCardModel(scroogeMcduckShushAgent);
//
//     defenderModel.exert();
//
//     testEngine.testStore.store.cardStore.challenge(
//       attackerModel.instanceId,
//       defenderModel.instanceId,
//     );
//
//     // Expect Scrooge to be returned to hand
//     expect(defenderModel.zone).toBe("hand");
//
//     // Expect attacker to remain in play
//     expect(attackerModel.zone).toBe("play");
//   });
//
//   it("ON THE MOVE - Should not return to hand when banished via damage", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: heHurledHisThunderbolt.cost,
//         hand: [heHurledHisThunderbolt],
//       },
//       {
//         play: [scroogeMcduckShushAgent],
//       },
//     );
//
//     const cardTarget = testEngine.getCardModel(scroogeMcduckShushAgent);
//
//     // Play heHurledHisThunderbolt
//     await testEngine.playCard(heHurledHisThunderbolt);
//
//     // Resolve the damage resolution by choosing scroogeMcduckShushAgent
//     await testEngine.resolveTopOfStack({ targets: [cardTarget] });
//
//     // Expect Scrooge to be in discard (banished), not hand
//     expect(cardTarget.zone).toBe("discard");
//   });
//
//   it("BACKUP PLAN - Should have the BACKUP PLAN ability defined", () => {
//     const backupPlan = scroogeMcduckShushAgent.abilities?.find(
//       (a) => "name" in a && a.name === "BACKUP PLAN",
//     );
//
//     expect(backupPlan).toBeDefined();
//
//     if (
//       backupPlan &&
//       "effects" in backupPlan &&
//       Array.isArray(backupPlan.effects)
//     ) {
//       // Should have both draw and discard effects
//       expect(backupPlan.effects).toHaveLength(2);
//
//       // First effect should be draw
//       const drawEffect = backupPlan.effects[0] as any;
//       expect(drawEffect.type).toBe("draw");
//       expect(drawEffect.amount).toBe(1);
//       expect(drawEffect.target.type).toBe("player");
//       expect(drawEffect.target.value).toBe("self");
//
//       // Second effect should be discard
//       const discardEffect = backupPlan.effects[1] as any;
//       expect(discardEffect.type).toBe("discard");
//       expect(discardEffect.amount).toBe(1);
//       expect(discardEffect.target.type).toBe("card");
//       expect(discardEffect.target.value).toBe(1);
//     }
//   });
//
//   it("ON THE MOVE - Should have the ON THE MOVE ability defined", () => {
//     const onTheMove = scroogeMcduckShushAgent.abilities?.find(
//       (a) => "name" in a && a.name === "ON THE MOVE",
//     );
//
//     expect(onTheMove).toBeDefined();
//     // Check that it has the correct structure for a challenged ability
//     expect(onTheMove).toHaveProperty("name", "ON THE MOVE");
//   });
//
//   it("ON THE MOVE - Should have return to hand effect", () => {
//     const onTheMove = scroogeMcduckShushAgent.abilities?.find(
//       (a) => "name" in a && a.name === "ON THE MOVE",
//     );
//
//     expect(onTheMove).toBeDefined();
//
//     if (
//       onTheMove &&
//       "effects" in onTheMove &&
//       Array.isArray(onTheMove.effects)
//     ) {
//       // Should have return to hand effect
//       expect(onTheMove.effects).toHaveLength(1);
//       const effect = onTheMove.effects[0] as any;
//       expect(effect.type).toBe("move");
//       expect(effect.to).toBe("hand");
//       expect(effect.target.type).toBe("card");
//       expect(effect.target.value).toBe("thisCharacter");
//     }
//   });
//
//   it("Should have both abilities present", () => {
//     expect(scroogeMcduckShushAgent.abilities).toBeDefined();
//     expect(scroogeMcduckShushAgent.abilities?.length).toBe(2);
//
//     const abilityNames = scroogeMcduckShushAgent.abilities?.map((a) =>
//       "name" in a ? a.name : "unknown",
//     );
//
//     expect(abilityNames).toContain("BACKUP PLAN");
//     expect(abilityNames).toContain("ON THE MOVE");
//   });
//
//   it("BACKUP PLAN - Should resolve effects individually", () => {
//     const backupPlan = scroogeMcduckShushAgent.abilities?.find(
//       (a) => "name" in a && a.name === "BACKUP PLAN",
//     );
//
//     expect(backupPlan).toBeDefined();
//     if (backupPlan && "resolveEffectsIndividually" in backupPlan) {
//       expect(backupPlan.resolveEffectsIndividually).toBe(true);
//     }
//     if (backupPlan && "dependentEffects" in backupPlan) {
//       expect(backupPlan.dependentEffects).toBe(false);
//     }
//   });
//
//   it("Should have correct rarity and set info", () => {
//     expect(scroogeMcduckShushAgent.rarity).toBe("super_rare");
//     expect(scroogeMcduckShushAgent.set).toBe("010");
//     expect(scroogeMcduckShushAgent.number).toBe(89);
//     expect(scroogeMcduckShushAgent.inkwell).toBe(false);
//     expect(scroogeMcduckShushAgent.colors).toEqual(["emerald"]);
//   });
// });
//
