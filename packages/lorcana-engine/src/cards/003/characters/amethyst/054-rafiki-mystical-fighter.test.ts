/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloGalacticHero,
  magicBroomBucketBrigade,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { rafikiMysticalFighter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { shenziHeadHyena } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
