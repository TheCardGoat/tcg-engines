import { all014Cards } from "@tcg/lorcana-cards/cards/014";
import { createFixture } from "./fixture-factory.js";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";

const set14CardsByPrintedNumber = [...all014Cards].sort((left, right) => {
  const numberDelta = left.cardNumber - right.cardNumber;
  if (numberDelta !== 0) {
    return numberDelta;
  }

  return left.id.localeCompare(right.id);
});

export const set14CardGalleryFixture: LorcanaSimulatorFixture = createFixture({
  id: "set14-card-gallery",
  name: "Set 14 Card Gallery",
  description:
    "All Set 14 (Hyperia City) cards rendered face up in one browser fixture. Oversized hands render as a scrollable strip (mouse wheel scrolls sideways); 30 ink + 2 ink drops let reviewers play any card straight from the strip.",
  skipPreGame: true,
  playerOne: {
    deck: [],
    discard: [],
    hand: set14CardsByPrintedNumber,
    inkwell: 30,
    inkDrops: 2,
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
  seed: "set14-card-gallery",
});
