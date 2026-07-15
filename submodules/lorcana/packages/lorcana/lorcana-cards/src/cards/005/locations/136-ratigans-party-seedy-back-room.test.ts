import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { ratigansPartySeedyBackRoom } from "./136-ratigans-party-seedy-back-room";

const damagedResident = createMockCharacter({
  id: "ratigan-damaged-resident",
  name: "Damaged Resident",
  cost: 2,
});

const undamagedResident = createMockCharacter({
  id: "ratigan-undamaged-resident",
  name: "Undamaged Resident",
  cost: 2,
});

const otherLocation = createMockLocation({
  id: "ratigan-other-location",
  name: "Other Location",
  cost: 2,
  willpower: 5,
  moveCost: 1,
});

describe("Ratigan's Party - Seedy Back Room", () => {
  it("gets +2 lore while you have a damaged character here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        ratigansPartySeedyBackRoom,
        { card: damagedResident, atLocation: ratigansPartySeedyBackRoom, damage: 1 },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(ratigansPartySeedyBackRoom)?.lore).toBe(
      ratigansPartySeedyBackRoom.lore + 2,
    );
  });

  it("does NOT get +2 lore when a character at the location is undamaged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        ratigansPartySeedyBackRoom,
        { card: undamagedResident, atLocation: ratigansPartySeedyBackRoom },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(ratigansPartySeedyBackRoom)?.lore).toBe(
      ratigansPartySeedyBackRoom.lore,
    );
  });

  it("does NOT get +2 lore when there are no characters at the location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ratigansPartySeedyBackRoom],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(ratigansPartySeedyBackRoom)?.lore).toBe(
      ratigansPartySeedyBackRoom.lore,
    );
  });

  it("does NOT get +2 lore when a damaged character is at a different location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        ratigansPartySeedyBackRoom,
        otherLocation,
        { card: damagedResident, atLocation: otherLocation, damage: 1 },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(ratigansPartySeedyBackRoom)?.lore).toBe(
      ratigansPartySeedyBackRoom.lore,
    );
  });
});
