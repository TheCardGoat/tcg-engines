/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { theBeastIsMine } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { whiteRabbitPocketWatch } from "@lorcanito/lorcana-engine/cards/001/items/items";
import {
  aliceGrowingGirl,
  mulanSoldierInTraining,
  peterPansShadowNotSewnOn,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const characterWithRush = mulanSoldierInTraining;

// This test suite is testing implementation details, during a future refactor it's advised to delete the whole suite and start over
describe.skip("Fixed point evaluation", () => {
  it("foo", () => {
    expect(true).toBe(true);
  });

  // it("Delays evaluation of abilities with self referencing target", () => {
  //   const testStore = new TestStore({
  //     play: [peterPansShadowNotSewnOn, characterWithRush],
  //   });
  //
  //   const initializeAbilities = testStore.store.effectStore.initializeAbilities;
  //
  //   expect(initializeAbilities.nonEvaluatedAbilities).toHaveLength(1);
  // });
  //
  // it("Delays evaluation of abilities with self referencing condition", () => {
  //   const testStore = new TestStore({
  //     play: [aliceGrowingGirl],
  //   });
  //
  //   const initializeAbilities = testStore.store.effectStore.initializeAbilities;
  //
  //   // Both abilities are delayed
  //   expect(initializeAbilities.nonEvaluatedAbilities).toHaveLength(2);
  // });
  //
  // describe("Getting all abilities", () => {
  //   it("Scenario 1", () => {
  //     const testStore = new TestStore({
  //       play: [aliceGrowingGirl],
  //     });
  //
  //     const allAbilities = testStore.store.effectStore.allAbilities();
  //
  //     // None of alice abilities are active
  //     expect(allAbilities).toHaveLength(0);
  //   });
  //
  //   it("Scenario 2", () => {
  //     const testStore = new TestStore({
  //       play: [peterPansShadowNotSewnOn],
  //     });
  //
  //     // Only rush and Evasive are active
  //     expect(testStore.store.effectStore.allAbilities()).toHaveLength(2);
  //   });
  //
  //   it("Scenario 3", () => {
  //     const testStore = new TestStore({
  //       play: [peterPansShadowNotSewnOn, mulanSoldierInTraining],
  //     });
  //
  //     const allAbilities = testStore.store.effectStore.allAbilities();
  //
  //     // Peter Pan has Rush and Evasive
  //     // Mulan has Native Rush, and Gained Evasive from Peter Pan
  //     expect(allAbilities).toHaveLength(4);
  //   });
  //
  //   it("Scenario 4", () => {
  //     const testStore = new TestStore(
  //       {
  //         inkwell: theBeastIsMine.cost,
  //         hand: [theBeastIsMine],
  //       },
  //       {
  //         inkwell: 1,
  //         play: [
  //           peterPansShadowNotSewnOn,
  //           liloMakingAWish,
  //           whiteRabbitPocketWatch,
  //         ],
  //       },
  //     );
  //
  //     const action = testStore.getCard(theBeastIsMine);
  //     const target = testStore.getCard(liloMakingAWish);
  //
  //     // Peter Pan has Rush and Evasive
  //     // Lilo has zero abilities
  //     // Pocket Watch has one ability, but it's filtered out
  //     expect(testStore.store.effectStore.allAbilities()).toHaveLength(2);
  //
  //     action.playFromHand();
  //     testStore.resolveTopOfStack({ targets: [target] });
  //
  //     expect(target.hasReckless).toBe(false);
  //
  //     testStore.passTurn();
  //     testStore.changePlayer("player_two");
  //
  //     // Lilo now has Reckless, but it's a continuous effect so length doesn't change
  //     expect(target.hasReckless).toBe(true);
  //
  //     // Continuous effects are not counted
  //     expect(testStore.store.effectStore.allAbilities()).toHaveLength(2);
  //
  //     const watch = testStore.getCard(whiteRabbitPocketWatch);
  //     watch.activate();
  //     testStore.resolveTopOfStack({ targets: [target] });
  //
  //     // Lilo now has Rush, and because of Peter she also has Evasive
  //     expect(target.hasRush).toBe(true);
  //     expect(target.hasEvasive).toBe(true);
  //
  //     // Length changed due to "Tip Toe" (Peter Pan's Shadow) being active.
  //     expect(testStore.store.effectStore.allAbilities()).toHaveLength(3);
  //   });
  //
  //   it("Scenario 5", () => {
  //     const testStore = new TestStore({
  //       inkwell: 1,
  //       play: [
  //         peterPansShadowNotSewnOn,
  //         liloMakingAWish,
  //         whiteRabbitPocketWatch,
  //       ],
  //     });
  //
  //     const target = testStore.getCard(liloMakingAWish);
  //     const watch = testStore.getCard(whiteRabbitPocketWatch);
  //
  //     expect(testStore.store.effectStore.allAbilities()).toHaveLength(2);
  //
  //     watch.activate();
  //
  //     // Not counting continuous effects in allAbilities (yet)
  //     expect(testStore.store.effectStore.allAbilities()).toHaveLength(2);
  //
  //     expect(target.hasEvasive).toBe(false);
  //     expect(target.hasRush).toBe(false);
  //     testStore.resolveTopOfStack({ targets: [target] });
  //     expect(target.hasRush).toBe(true);
  //     expect(target.hasEvasive).toBe(true);
  //
  //     expect(testStore.store.effectStore.allAbilities()).toHaveLength(3);
  //   });
  // });
});
