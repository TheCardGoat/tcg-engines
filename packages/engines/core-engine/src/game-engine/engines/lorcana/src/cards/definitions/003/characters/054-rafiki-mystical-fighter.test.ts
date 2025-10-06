/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { magicBroomBucketBrigade } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { rafikiMysticalFighter } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { shenziHeadHyena } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rafiki - Mystical Fighter", () => {
  it("**Challenger** +3 _(While challenging, this character gets +3 {S}.)_**ANCIENT SKILLS** Whenever he challenges a Hyena character, this character takes no damage from the challenge.", () => {
    const testStore = new TestStore({
      play: [rafikiMysticalFighter],
    });

    const cardUnderTest = testStore.getCard(rafikiMysticalFighter);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });

  it("Ancient Skills - Whenever he challenges a Hyena character, this character takes no damage from the challenge.", async () => {
    const testEngine = new TestEngine(
      {
        play: [rafikiMysticalFighter],
      },
      {
        play: [shenziHeadHyena],
      },
    );

    await testEngine.tapCard(shenziHeadHyena);

    const { attacker, defender } = await testEngine.challenge({
      attacker: rafikiMysticalFighter,
      defender: shenziHeadHyena,
    });

    expect(defender.damage).toBe(3);
    expect(attacker.damage).toBe(0);
    expect(attacker.isDead).toBe(false);
  });
});

describe("Regression", () => {
  it("can challenge a character with no damage", async () => {
    const testEngine = new TestEngine(
      {
        play: [rafikiMysticalFighter],
      },
      {
        play: [magicBroomBucketBrigade],
      },
    );

    await testEngine.tapCard(magicBroomBucketBrigade);

    const { attacker, defender } = await testEngine.challenge({
      attacker: rafikiMysticalFighter,
      defender: magicBroomBucketBrigade,
    });

    expect(defender.isDead).toBe(true);
  });
});
