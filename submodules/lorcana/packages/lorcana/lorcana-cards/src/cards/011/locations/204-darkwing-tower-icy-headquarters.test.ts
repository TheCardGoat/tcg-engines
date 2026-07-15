import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  type CardInput,
} from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { theThunderquack } from "../items/202-the-thunderquack";
import { darkwingTowerIcyHeadquarters } from "./204-darkwing-tower-icy-headquarters";

const towerResident = createMockCharacter({
  id: "darkwing-tower-resident",
  name: "Darkwing Tower Resident",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const secondTowerResident = createMockCharacter({
  id: "darkwing-tower-second-resident",
  name: "Darkwing Tower Second Resident",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const offsiteResident = createMockCharacter({
  id: "darkwing-tower-offsite-resident",
  name: "Darkwing Tower Offsite Resident",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const heroAttacker = createMockCharacter({
  id: "darkwing-hero-attacker",
  name: "Darkwing Hero Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const strongDefender = createMockCharacter({
  id: "darkwing-strong-defender",
  name: "Darkwing Strong Defender",
  cost: 4,
  strength: 5,
  willpower: 5,
});

const opposingVillain = createMockCharacter({
  id: "darkwing-opposing-villain",
  name: "Opposing Villain",
  cost: 3,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Villain"],
});

const secondOpposingVillain = createMockCharacter({
  id: "darkwing-second-opposing-villain",
  name: "Second Opposing Villain",
  cost: 3,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Villain"],
});

const opposingNonVillain = createMockCharacter({
  id: "darkwing-opposing-non-villain",
  name: "Opposing Non-Villain",
  cost: 3,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Hero"],
});

function resolveTowerTrigger(
  testEngine: LorcanaMultiplayerTestEngine,
  options: { resolveOptional?: boolean; targets?: CardInput[] },
) {
  expect(
    testEngine.asPlayerOne().resolvePendingByCard(darkwingTowerIcyHeadquarters, {
      resolveOptional: options.resolveOptional,
      targets: options.targets,
    }),
  ).toBeSuccessfulCommand();
}

describe("Darkwing Tower - Icy Headquarters", () => {
  it("triggers when an opposing Villain character is banished during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          darkwingTowerIcyHeadquarters,
          { card: towerResident, atLocation: darkwingTowerIcyHeadquarters, exerted: true },
        ],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [opposingVillain],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [opposingVillain],
      }),
    ).toBeSuccessfulCommand();
    resolveTowerTrigger(testEngine, {
      resolveOptional: true,
      targets: [towerResident],
    });

    expect(testEngine.asPlayerOne()).toBeReady(towerResident);
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: towerResident,
      restriction: "cant-quest",
    });
  });

  it("does not trigger when a non-Villain opposing character is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          darkwingTowerIcyHeadquarters,
          { card: towerResident, atLocation: darkwingTowerIcyHeadquarters, exerted: true },
        ],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [opposingNonVillain],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [opposingNonVillain],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().isExerted(towerResident)).toBe(true);
  });

  it("triggers when The Thunderquack makes an opposing character a Villain", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          darkwingTowerIcyHeadquarters,
          { card: towerResident, atLocation: darkwingTowerIcyHeadquarters, exerted: true },
          theThunderquack,
        ],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [opposingNonVillain],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [opposingNonVillain],
      }),
    ).toBeSuccessfulCommand();
    resolveTowerTrigger(testEngine, {
      resolveOptional: true,
      targets: [towerResident],
    });

    expect(testEngine.asPlayerOne()).toBeReady(towerResident);
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: towerResident,
      restriction: "cant-quest",
    });
  });

  it("triggers when a Villain is banished in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          darkwingTowerIcyHeadquarters,
          { card: towerResident, atLocation: darkwingTowerIcyHeadquarters, exerted: true },
          heroAttacker,
        ],
      },
      {
        play: [{ card: opposingVillain, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(heroAttacker, opposingVillain),
    ).toBeSuccessfulCommand();
    resolveTowerTrigger(testEngine, {
      resolveOptional: true,
      targets: [towerResident],
    });

    expect(testEngine.asPlayerOne()).toBeReady(towerResident);
  });

  it("does not trigger during the opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          darkwingTowerIcyHeadquarters,
          { card: towerResident, atLocation: darkwingTowerIcyHeadquarters, exerted: true },
          { card: strongDefender, exerted: true },
        ],
      },
      {
        play: [opposingVillain],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingVillain, strongDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().isExerted(towerResident)).toBe(true);
  });

  it("only targets characters at this location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          darkwingTowerIcyHeadquarters,
          { card: towerResident, atLocation: darkwingTowerIcyHeadquarters, exerted: true },
          { card: offsiteResident, exerted: true },
        ],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [opposingVillain],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [opposingVillain],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darkwingTowerIcyHeadquarters, {
        targets: [towerResident],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeReady(towerResident);
    expect(testEngine.asPlayerOne().isExerted(offsiteResident)).toBe(true);
  });

  it("is optional and can be declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          darkwingTowerIcyHeadquarters,
          { card: towerResident, atLocation: darkwingTowerIcyHeadquarters },
        ],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [opposingVillain],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [opposingVillain],
      }),
    ).toBeSuccessfulCommand();
    resolveTowerTrigger(testEngine, {
      resolveOptional: false,
    });

    expect(testEngine.asPlayerOne().quest(towerResident).success).toBe(true);
    expect(testEngine.asPlayerOne()).not.toHaveRestriction({
      card: towerResident,
      restriction: "cant-quest",
    });
  });

  it("applies the quest restriction only when the ability is used", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          darkwingTowerIcyHeadquarters,
          { card: towerResident, atLocation: darkwingTowerIcyHeadquarters },
        ],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [opposingVillain],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [opposingVillain],
      }),
    ).toBeSuccessfulCommand();
    resolveTowerTrigger(testEngine, {
      resolveOptional: true,
      targets: [towerResident],
    });

    expect(testEngine.asPlayerOne().quest(towerResident).success).toBe(false);
  });

  it("triggers multiple times if multiple Villain characters are banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          darkwingTowerIcyHeadquarters,
          { card: towerResident, atLocation: darkwingTowerIcyHeadquarters, exerted: true },
          { card: secondTowerResident, atLocation: darkwingTowerIcyHeadquarters, exerted: true },
          heroAttacker,
        ],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [opposingVillain, { card: secondOpposingVillain, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [opposingVillain],
      }),
    ).toBeSuccessfulCommand();
    resolveTowerTrigger(testEngine, {
      resolveOptional: true,
      targets: [towerResident],
    });
    expect(
      testEngine.asPlayerOne().challenge(heroAttacker, secondOpposingVillain),
    ).toBeSuccessfulCommand();
    resolveTowerTrigger(testEngine, {
      resolveOptional: true,
      targets: [secondTowerResident],
    });

    expect(testEngine.asPlayerOne()).toBeReady(towerResident);
    expect(testEngine.asPlayerOne()).toBeReady(secondTowerResident);
  });
});
