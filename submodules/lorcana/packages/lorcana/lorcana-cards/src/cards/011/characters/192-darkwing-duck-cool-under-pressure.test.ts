import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { donaldDuckAlongForTheRide } from "./178-donald-duck-along-for-the-ride";
import { darkwingDuckCoolUnderPressure } from "./192-darkwing-duck-cool-under-pressure";

const banishedItemTarget = createMockItem({
  id: "darkwing-cool-under-pressure-banish-target",
  name: "Banish Target Item",
  cost: 1,
});

const readyVillain = createMockCharacter({
  id: "darkwing-cool-under-pressure-villain",
  name: "Ready Villain",
  cost: 3,
  strength: 2,
  willpower: 4,
  classifications: ["Storyborn", "Villain"],
});

const readyHero = createMockCharacter({
  id: "darkwing-cool-under-pressure-hero",
  name: "Ready Hero",
  cost: 3,
  strength: 2,
  willpower: 4,
  classifications: ["Storyborn", "Hero"],
});

const damageTarget = createMockCharacter({
  id: "darkwing-cool-under-pressure-damage-target",
  name: "Damage Target",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Darkwing Duck - Cool Under Pressure", () => {
  it("has the printed classification mix", () => {
    expect(darkwingDuckCoolUnderPressure.classifications).toContain("Super");
  });

  it("TAKE THAT! - when an item is banished during your turn, you may pay 1 ink to deal 2 damage to chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [darkwingDuckCoolUnderPressure],
        hand: [donaldDuckAlongForTheRide],
        inkwell: donaldDuckAlongForTheRide.cost + 1,
      },
      {
        play: [banishedItemTarget, damageTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(donaldDuckAlongForTheRide)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(donaldDuckAlongForTheRide, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [banishedItemTarget] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darkwingDuckCoolUnderPressure, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [damageTarget] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(damageTarget)).toBe(2);
  });

  it("EVILDOERS BEWARE! - can challenge ready Villain characters, but not other ready characters", () => {
    const villainChallengeEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [darkwingDuckCoolUnderPressure],
      },
      {
        play: [readyVillain],
      },
    );

    expect(
      villainChallengeEngine.asPlayerOne().challenge(darkwingDuckCoolUnderPressure, readyVillain),
    ).toBeSuccessfulCommand();
    expect(villainChallengeEngine.asPlayerTwo().getCardZone(readyVillain)).toBe("discard");

    const heroChallengeEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [darkwingDuckCoolUnderPressure],
      },
      {
        play: [readyHero],
      },
    );

    expect(
      heroChallengeEngine.asPlayerOne().challenge(darkwingDuckCoolUnderPressure, readyHero),
    ).not.toBeSuccessfulCommand();
    expect(heroChallengeEngine.asPlayerTwo().getCardZone(readyHero)).toBe("play");
  });
});
