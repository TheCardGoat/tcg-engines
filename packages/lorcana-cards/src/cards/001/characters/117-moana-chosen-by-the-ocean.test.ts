import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { moanaChosenByTheOcean } from "./117-moana-chosen-by-the-ocean";

describe("Moana - Chosen by the Ocean", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [moanChosenByTheOcean] });
  //   expect(testEngine.getCardModel(moanChosenByTheOcean).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mauiHeroToAll,
//   moanChosenByTheOcean,
//   teKaHeartless,
//   teKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Moana Chosen By The Ocean", () => {
//   describe("**THIS IS NOT WHO YOU ARE** When you play this character, you may banish chosen character named Te Ka.", () => {
//     it("banishes Te Ka The Burning One", () => {
//       const testStore = new TestStore({
//         inkwell: moanChosenByTheOcean.cost,
//         hand: [moanChosenByTheOcean],
//         play: [teKaTheBurningOne],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         moanChosenByTheOcean.id,
//       );
//       const target = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       cardUnderTest.playFromHand();
//       testStore.resolveOptionalAbility();
//       testStore.resolveTopOfStack({
//         targetId: target.instanceId,
//       });
//
//       expect(target.zone).toEqual("discard");
//     });
//
//     it("banishes Te Ka Heartless", () => {
//       const testStore = new TestStore({
//         inkwell: moanChosenByTheOcean.cost,
//         hand: [moanChosenByTheOcean],
//         play: [teKaHeartless],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         moanChosenByTheOcean.id,
//       );
//       const target = testStore.getByZoneAndId("play", teKaHeartless.id);
//
//       cardUnderTest.playFromHand();
//       testStore.resolveOptionalAbility();
//
//       testStore.resolveTopOfStack({
//         targetId: target.instanceId,
//       });
//
//       expect(target.zone).toEqual("discard");
//     });
//
//     it("does not banishes non Teka character", () => {
//       const testStore = new TestStore({
//         inkwell: moanChosenByTheOcean.cost,
//         hand: [moanChosenByTheOcean],
//         play: [mauiHeroToAll],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         moanChosenByTheOcean.id,
//       );
//       const shouldNotBeTarget = testStore.getByZoneAndId(
//         "play",
//         mauiHeroToAll.id,
//       );
//
//       cardUnderTest.playFromHand();
//
//       testStore.resolveTopOfStack();
//
//       expect(shouldNotBeTarget.zone).toEqual("play");
//     });
//   });
// });
//
