import { all013Cards } from "@tcg/lorcana-cards/cards/013";
import { createFixture } from "./fixture-factory.js";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";

const set13CardsByPrintedNumber = [...all013Cards].sort((left, right) => {
  const numberDelta = left.cardNumber - right.cardNumber;
  if (numberDelta !== 0) {
    return numberDelta;
  }

  return left.id.localeCompare(right.id);
});

export const set13CardGalleryFixture: LorcanaSimulatorFixture = createFixture({
  id: "set13-card-gallery",
  name: "Set 13 Card Gallery",
  description: "All Set 13 cards rendered face up in one browser fixture.",
  skipPreGame: true,
  playerOne: {
    deck: [],
    discard: [],
    hand: set13CardsByPrintedNumber,
    inkwell: [],
    lore: 0,
    play: [],
  },
  playerTwo: {
    deck: [],
    discard: [],
    hand: [],
    inkwell: [],
    lore: 0,
    play: [],
  },
  seed: "set13-card-gallery",
});
