import { createFixture } from "./fixture-factory.js";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";

export const preGameFixture: LorcanaSimulatorFixture = createFixture({
  id: "pre-game",
  name: "Pre-Game",
  description: "Fresh hands and realistic decks for running full pre-game setup flow.",
  seed: "storybook-local-pre-game",
  skipPreGame: false,
  playerOne: {
    deck: 60,
    hand: 0,
    inkwell: 0,
    lore: 0,
    play: [],
    discard: [],
  },
  playerTwo: {
    deck: 60,
    hand: 0,
    inkwell: 0,
    lore: 0,
    play: [],
    discard: [],
  },
});
