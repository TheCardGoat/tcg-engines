import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { potionOfMalice } from "./098-potion-of-malice";

const pingTarget = createMockCharacter({
  id: "potion-of-malice-ping-target",
  name: "Ping Target",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const damagedEnemy = createMockCharacter({
  id: "potion-of-malice-damaged-enemy",
  name: "Damaged Enemy",
  cost: 3,
  strength: 3,
  willpower: 4,
});

const healthyEnemy = createMockCharacter({
  id: "potion-of-malice-healthy-enemy",
  name: "Healthy Enemy",
  cost: 3,
  strength: 3,
  willpower: 4,
});

describe("Potion of Malice", () => {
  it("puts 1 damage on the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [potionOfMalice],
      },
      {
        play: [pingTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(potionOfMalice, {
        ability: "SUPPRESSED ANGER",
        targets: [pingTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(potionOfMalice)).toBe(true);
    expect(testEngine.asPlayerTwo().getDamage(pingTarget)).toBe(1);
  });

  it("gives each opposing damaged character Reckless until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [potionOfMalice],
      },
      {
        deck: 2,
        play: [damagedEnemy, healthyEnemy],
      },
    );

    expect(testEngine.asServer().manualSetDamage(damagedEnemy, 1)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().activateAbility(potionOfMalice, { ability: "MINDLESS RAGE" }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(potionOfMalice)).toBe("discard");
    expect(testEngine.asPlayerTwo().hasKeyword(damagedEnemy, "Reckless")).toBe(true);
    expect(testEngine.asPlayerTwo().hasKeyword(healthyEnemy, "Reckless")).toBe(false);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().hasKeyword(damagedEnemy, "Reckless")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().hasKeyword(damagedEnemy, "Reckless")).toBe(false);
  });
});
