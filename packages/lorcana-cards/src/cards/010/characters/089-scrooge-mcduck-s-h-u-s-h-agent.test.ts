// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HeHurledHisThunderbolt,
//   MickeyMouseDetective,
//   ScroogeMcduckShushAgent,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Scrooge McDuck - S.H.U.S.H. Agent", () => {
//   It("Character should have correct base stats", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [scroogeMcduckShushAgent],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       ScroogeMcduckShushAgent.id,
//     );
//
//     // Check base stats
//     Expect(cardUnderTest.cost).toBe(2);
//     Expect(cardUnderTest.strength).toBe(0);
//     Expect(cardUnderTest.willpower).toBe(2);
//     Expect(cardUnderTest.lore).toBe(2);
//     Expect(cardUnderTest.characteristics).toEqual(["storyborn", "hero"]);
//   });
//
//   It("Character can be played with correct cost", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: scroogeMcduckShushAgent.cost,
//       Hand: [scroogeMcduckShushAgent],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       ScroogeMcduckShushAgent.id,
//     );
//
//     Await testEngine.playCard(cardUnderTest);
//     Const scroogeInPlay = testEngine.getByZoneAndId(
//       "play",
//       ScroogeMcduckShushAgent.id,
//     );
//     Expect(scroogeInPlay.zone).toBe("play");
//   });
//
//   It("BACKUP PLAN - Should trigger draw effect when played", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: scroogeMcduckShushAgent.cost,
//       Hand: [scroogeMcduckShushAgent],
//       Deck: [mickeyMouseDetective],
//     });
//
//     // Initial hand count should be 1 (Scrooge)
//     Expect(testEngine.getZonesCardCount().hand).toBe(1);
//
//     // Play Scrooge
//     Await testEngine.playCard(scroogeMcduckShushAgent);
//
//     // The draw effect should trigger, making hand count at least 1
//     // (the discard effect may or may not be resolved automatically)
//     Expect(testEngine.getZonesCardCount().hand).toBeGreaterThanOrEqual(1);
//
//     // Resolve top of the stack to trigger discard effect
//     Const discardTarget = testEngine.getCardModel(mickeyMouseDetective);
//     Await testEngine.resolveTopOfStack({ targets: [discardTarget] });
//
//     // Verify no card in hand and 1 card in discard
//     Expect(testEngine.getZonesCardCount().hand).toBe(0);
//     Expect(testEngine.getZonesCardCount().discard).toBe(1);
//   });
//
//   It("ON THE MOVE - Should return to hand when challenged", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [mickeyMouseDetective],
//       },
//       {
//         Play: [scroogeMcduckShushAgent],
//       },
//     );
//
//     Const attackerModel = testEngine.getCardModel(mickeyMouseDetective);
//     Const defenderModel = testEngine.getCardModel(scroogeMcduckShushAgent);
//
//     DefenderModel.exert();
//
//     TestEngine.testStore.store.cardStore.challenge(
//       AttackerModel.instanceId,
//       DefenderModel.instanceId,
//     );
//
//     // Expect Scrooge to be returned to hand
//     Expect(defenderModel.zone).toBe("hand");
//
//     // Expect attacker to remain in play
//     Expect(attackerModel.zone).toBe("play");
//   });
//
//   It("ON THE MOVE - Should not return to hand when banished via damage", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: heHurledHisThunderbolt.cost,
//         Hand: [heHurledHisThunderbolt],
//       },
//       {
//         Play: [scroogeMcduckShushAgent],
//       },
//     );
//
//     Const cardTarget = testEngine.getCardModel(scroogeMcduckShushAgent);
//
//     // Play heHurledHisThunderbolt
//     Await testEngine.playCard(heHurledHisThunderbolt);
//
//     // Resolve the damage resolution by choosing scroogeMcduckShushAgent
//     Await testEngine.resolveTopOfStack({ targets: [cardTarget] });
//
//     // Expect Scrooge to be in discard (banished), not hand
//     Expect(cardTarget.zone).toBe("discard");
//   });
//
//   It("BACKUP PLAN - Should have the BACKUP PLAN ability defined", () => {
//     Const backupPlan = scroogeMcduckShushAgent.abilities?.find(
//       (a) => "name" in a && a.name === "BACKUP PLAN",
//     );
//
//     Expect(backupPlan).toBeDefined();
//
//     If (
//       BackupPlan &&
//       "effects" in backupPlan &&
//       Array.isArray(backupPlan.effects)
//     ) {
//       // Should have both draw and discard effects
//       Expect(backupPlan.effects).toHaveLength(2);
//
//       // First effect should be draw
//       Const drawEffect = backupPlan.effects[0] as any;
//       Expect(drawEffect.type).toBe("draw");
//       Expect(drawEffect.amount).toBe(1);
//       Expect(drawEffect.target.type).toBe("player");
//       Expect(drawEffect.target.value).toBe("self");
//
//       // Second effect should be discard
//       Const discardEffect = backupPlan.effects[1] as any;
//       Expect(discardEffect.type).toBe("discard");
//       Expect(discardEffect.amount).toBe(1);
//       Expect(discardEffect.target.type).toBe("card");
//       Expect(discardEffect.target.value).toBe(1);
//     }
//   });
//
//   It("ON THE MOVE - Should have the ON THE MOVE ability defined", () => {
//     Const onTheMove = scroogeMcduckShushAgent.abilities?.find(
//       (a) => "name" in a && a.name === "ON THE MOVE",
//     );
//
//     Expect(onTheMove).toBeDefined();
//     // Check that it has the correct structure for a challenged ability
//     Expect(onTheMove).toHaveProperty("name", "ON THE MOVE");
//   });
//
//   It("ON THE MOVE - Should have return to hand effect", () => {
//     Const onTheMove = scroogeMcduckShushAgent.abilities?.find(
//       (a) => "name" in a && a.name === "ON THE MOVE",
//     );
//
//     Expect(onTheMove).toBeDefined();
//
//     If (
//       OnTheMove &&
//       "effects" in onTheMove &&
//       Array.isArray(onTheMove.effects)
//     ) {
//       // Should have return to hand effect
//       Expect(onTheMove.effects).toHaveLength(1);
//       Const effect = onTheMove.effects[0] as any;
//       Expect(effect.type).toBe("move");
//       Expect(effect.to).toBe("hand");
//       Expect(effect.target.type).toBe("card");
//       Expect(effect.target.value).toBe("thisCharacter");
//     }
//   });
//
//   It("Should have both abilities present", () => {
//     Expect(scroogeMcduckShushAgent.abilities).toBeDefined();
//     Expect(scroogeMcduckShushAgent.abilities?.length).toBe(2);
//
//     Const abilityNames = scroogeMcduckShushAgent.abilities?.map((a) =>
//       "name" in a ? a.name : "unknown",
//     );
//
//     Expect(abilityNames).toContain("BACKUP PLAN");
//     Expect(abilityNames).toContain("ON THE MOVE");
//   });
//
//   It("BACKUP PLAN - Should resolve effects individually", () => {
//     Const backupPlan = scroogeMcduckShushAgent.abilities?.find(
//       (a) => "name" in a && a.name === "BACKUP PLAN",
//     );
//
//     Expect(backupPlan).toBeDefined();
//     If (backupPlan && "resolveEffectsIndividually" in backupPlan) {
//       Expect(backupPlan.resolveEffectsIndividually).toBe(true);
//     }
//     If (backupPlan && "dependentEffects" in backupPlan) {
//       Expect(backupPlan.dependentEffects).toBe(false);
//     }
//   });
//
//   It("Should have correct rarity and set info", () => {
//     Expect(scroogeMcduckShushAgent.rarity).toBe("super_rare");
//     Expect(scroogeMcduckShushAgent.set).toBe("010");
//     Expect(scroogeMcduckShushAgent.number).toBe(89);
//     Expect(scroogeMcduckShushAgent.inkwell).toBe(false);
//     Expect(scroogeMcduckShushAgent.colors).toEqual(["emerald"]);
//   });
// });
//
