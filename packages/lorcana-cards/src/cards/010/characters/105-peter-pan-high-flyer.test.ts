import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { peterPanHighFlyer } from "./105-peter-pan-high-flyer";

describe("Peter Pan - High Flyer", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [peterPanHighFlyer],
    });

    const cardUnderTest = testEngine.getCardModel(peterPanHighFlyer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { geniePowerUnleashed } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { peterPansShadowNotSewnOn } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { peterPanHighFlyer } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Peter Pan - High Flyer", () => {
//   describe("Evasive (Only characters with Evasive can challenge this character.)", () => {
//     it("should have Evasive ability", () => {
//       const testEngine = new TestEngine({
//         play: [peterPanHighFlyer],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(peterPanHighFlyer);
//       expect(cardUnderTest.hasEvasive).toBe(true);
//     });
//
//     it("can challenge another evasive character", () => {
//       const testEngine = new TestEngine(
//         {
//           play: [peterPanHighFlyer],
//         },
//         {
//           play: [peterPansShadowNotSewnOn],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(peterPanHighFlyer);
//       const defender = testEngine.getCardModel(peterPansShadowNotSewnOn);
//
//       defender.updateCardMeta({ exerted: true });
//       expect(defender.ready).toBe(false);
//       expect(defender.hasEvasive).toBe(true);
//
//       cardUnderTest.challenge(defender);
//
//       expect(cardUnderTest.meta.damage).toBe(2);
//       expect(cardUnderTest.meta.exerted).toBe(true);
//       expect(defender.meta.damage).toBe(1);
//       expect(testEngine.getCardZone(cardUnderTest)).toBe("play");
//       expect(testEngine.getCardZone(defender)).toBe("play");
//     });
//
//     it("can be challenged by another evasive character", () => {
//       const testEngine = new TestEngine(
//         {
//           play: [geniePowerUnleashed],
//         },
//         {
//           play: [peterPanHighFlyer],
//         },
//       );
//
//       const attacker = testEngine.getCardModel(geniePowerUnleashed);
//       const cardUnderTest = testEngine.getCardModel(peterPanHighFlyer);
//
//       cardUnderTest.updateCardMeta({ exerted: true });
//       expect(cardUnderTest.ready).toBe(false);
//       expect(attacker.hasEvasive).toBe(true);
//
//       attacker.challenge(cardUnderTest);
//
//       expect(attacker.meta.damage).toBe(1);
//       expect(attacker.meta.exerted).toBe(true);
//       expect(testEngine.getCardZone(cardUnderTest)).toBe("discard");
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [peterPanHighFlyer],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(peterPanHighFlyer);
//
//       expect(cardUnderTest.strength).toBe(1);
//       expect(cardUnderTest.willpower).toBe(3);
//       expect(cardUnderTest.lore).toBe(2);
//       expect(cardUnderTest.cost).toBe(3);
//     });
//
//     it("should be inkwell card", () => {
//       expect(peterPanHighFlyer.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(peterPanHighFlyer.characteristics).toEqual(["storyborn", "hero"]);
//     });
//
//     it("should be ruby color", () => {
//       expect(peterPanHighFlyer.colors).toEqual(["ruby"]);
//     });
//   });
//
//   describe("Gameplay", () => {
//     it("should be playable from hand", async () => {
//       const testEngine = new TestEngine({
//         inkwell: peterPanHighFlyer.cost,
//         hand: [peterPanHighFlyer],
//       });
//
//       await testEngine.playCard(peterPanHighFlyer);
//
//       const cardUnderTest = testEngine.getCardModel(peterPanHighFlyer);
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("can quest for lore", async () => {
//       const testEngine = new TestEngine({
//         play: [peterPanHighFlyer],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(peterPanHighFlyer);
//
//       await testEngine.questCard(peterPanHighFlyer);
//
//       expect(cardUnderTest.meta.exerted).toBe(true);
//       expect(testEngine.getPlayerLore("player_one")).toBe(2);
//     });
//   });
// });
//
