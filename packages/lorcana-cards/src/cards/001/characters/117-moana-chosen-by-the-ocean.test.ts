import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { moanaChosenByTheOcean } from "./117-moana-chosen-by-the-ocean";

describe("Moana - Chosen by the Ocean", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [moanChosenByTheOcean] });
  //   Expect(testEngine.getCardModel(moanChosenByTheOcean).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MauiHeroToAll,
//   MoanChosenByTheOcean,
//   TeKaHeartless,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Moana Chosen By The Ocean", () => {
//   Describe("**THIS IS NOT WHO YOU ARE** When you play this character, you may banish chosen character named Te Ka.", () => {
//     It("banishes Te Ka The Burning One", () => {
//       Const testStore = new TestStore({
//         Inkwell: moanChosenByTheOcean.cost,
//         Hand: [moanChosenByTheOcean],
//         Play: [teKaTheBurningOne],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         MoanChosenByTheOcean.id,
//       );
//       Const target = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({
//         TargetId: target.instanceId,
//       });
//
//       Expect(target.zone).toEqual("discard");
//     });
//
//     It("banishes Te Ka Heartless", () => {
//       Const testStore = new TestStore({
//         Inkwell: moanChosenByTheOcean.cost,
//         Hand: [moanChosenByTheOcean],
//         Play: [teKaHeartless],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         MoanChosenByTheOcean.id,
//       );
//       Const target = testStore.getByZoneAndId("play", teKaHeartless.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//
//       TestStore.resolveTopOfStack({
//         TargetId: target.instanceId,
//       });
//
//       Expect(target.zone).toEqual("discard");
//     });
//
//     It("does not banishes non Teka character", () => {
//       Const testStore = new TestStore({
//         Inkwell: moanChosenByTheOcean.cost,
//         Hand: [moanChosenByTheOcean],
//         Play: [mauiHeroToAll],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         MoanChosenByTheOcean.id,
//       );
//       Const shouldNotBeTarget = testStore.getByZoneAndId(
//         "play",
//         MauiHeroToAll.id,
//       );
//
//       CardUnderTest.playFromHand();
//
//       TestStore.resolveTopOfStack();
//
//       Expect(shouldNotBeTarget.zone).toEqual("play");
//     });
//   });
// });
//
