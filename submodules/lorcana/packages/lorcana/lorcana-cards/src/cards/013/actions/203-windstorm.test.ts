import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { windstorm } from "./203-windstorm";

const normalCharacter = createMockCharacter({
  id: "windstorm-normal-character",
  name: "Normal Character",
  cost: 2,
  willpower: 5,
});

const evasiveCharacter = createMockCharacter({
  id: "windstorm-evasive-character",
  name: "Evasive Character",
  cost: 2,
  willpower: 5,
  abilities: [evasive],
});

const normalLocation = createMockLocation({
  id: "windstorm-normal-location",
  name: "Normal Location",
  cost: 2,
  willpower: 5,
});

const evasiveLocation = createMockLocation({
  id: "windstorm-evasive-location",
  name: "Evasive Location",
  cost: 2,
  willpower: 5,
  abilities: [evasive],
});

describe("Windstorm", () => {
  it("deals 1 damage to opposing characters and locations, then 2 more to those with Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [windstorm],
        inkwell: windstorm.cost,
      },
      {
        play: [normalCharacter, evasiveCharacter, normalLocation, evasiveLocation],
      },
    );

    expect(testEngine.asPlayerOne().playCard(windstorm)).toBeSuccessfulCommand();

    expect(testEngine.getCard(normalCharacter).damage).toBe(1);
    expect(testEngine.getCard(normalLocation).damage).toBe(1);
    expect(testEngine.getCard(evasiveCharacter).damage).toBe(3);
    expect(testEngine.getCard(evasiveLocation).damage).toBe(3);
  });
});
