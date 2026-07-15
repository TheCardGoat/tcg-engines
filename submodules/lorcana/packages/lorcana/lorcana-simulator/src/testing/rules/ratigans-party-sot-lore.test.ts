import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { ratigansPartySeedyBackRoom } from "@tcg/lorcana-cards/cards/005";

const damagedResident = createMockCharacter({
  id: "ratigan-sot-damaged",
  name: "Damaged Resident",
  cost: 2,
});

/**
 * THE-964: Location lore at start of turn (`gainLoreFromLocations`) must include
 * MISFITS' REVELRY when a damaged character is at Ratigan's Party.
 */
describe("Ratigan's Party — location lore at start of turn", () => {
  it("adds bonus lore when the turn returns to the location controller", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          ratigansPartySeedyBackRoom,
          { card: damagedResident, atLocation: ratigansPartySeedyBackRoom, damage: 1 },
        ],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    const expectedDelta =
      ratigansPartySeedyBackRoom.lore + 2; /* MISFITS' REVELRY while damaged character here */

    const loreBefore = testEngine.getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);
    expect(testEngine.asPlayerTwo().passTurn().success).toBe(true);
    const loreAfter = testEngine.getLore(PLAYER_ONE);

    expect(loreAfter - loreBefore).toBe(expectedDelta);
  });

  it("includes bonus lore after damage is applied mid-game (registry must invalidate)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          ratigansPartySeedyBackRoom,
          { card: damagedResident, atLocation: ratigansPartySeedyBackRoom },
        ],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().getCard(damagedResident).damage).toBe(0);

    expect(testEngine.asServer().manualSetDamage(damagedResident, 1).success).toBe(true);
    expect(testEngine.asPlayerOne().getCard(damagedResident).damage).toBe(1);
    expect(testEngine.asPlayerOne().getCard(ratigansPartySeedyBackRoom).lore).toBe(
      ratigansPartySeedyBackRoom.lore + 2,
    );

    const expectedDelta =
      ratigansPartySeedyBackRoom.lore + 2; /* MISFITS' REVELRY while damaged character here */

    const loreBefore = testEngine.getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);
    expect(testEngine.asPlayerTwo().passTurn().success).toBe(true);
    const loreAfter = testEngine.getLore(PLAYER_ONE);

    expect(loreAfter - loreBefore).toBe(expectedDelta);
  });
});
