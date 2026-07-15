import { bibbidiBobbidiBoo } from "@tcg/lorcana-cards/cards/002";
import {
  cheshireCatAlwaysGrinning,
  flynnRiderConfidentVagabond,
} from "@tcg/lorcana-cards/cards/002";
import { donaldDuckBoisterousFowl, tamatoaDrabLittleCrab } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "./fixture-factory";

export const bibbidiBobbidiBooFixture = createFixture({
  id: "bibbidi-bobbidi-boo",
  name: "Bibbidi Bobbidi Boo",
  description:
    "Visual setup for Bibbidi Bobbidi Boo. Play the song/action, choose one of your characters in play to return, then choose a character in hand with the same cost or less to play for free. Includes multiple eligible targets and one higher-cost hand card that should stay unavailable after returning Flynn.",
  skipPreGame: true,
  playerOne: {
    inkwell: bibbidiBobbidiBoo.cost,
    hand: [
      bibbidiBobbidiBoo,
      cheshireCatAlwaysGrinning,
      donaldDuckBoisterousFowl,
      flynnRiderConfidentVagabond,
    ],
    play: [tamatoaDrabLittleCrab, flynnRiderConfidentVagabond],
    deck: 8,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 8,
    lore: 0,
  },
  seed: "bibbidi-bobbidi-boo",
});
