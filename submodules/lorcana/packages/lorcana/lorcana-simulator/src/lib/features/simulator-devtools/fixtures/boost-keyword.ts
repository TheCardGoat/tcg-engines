import { createFixture } from "./fixture-factory";
import {
  hakunaMatata,
  mickeyMouseTrueFriend,
  reflection,
  simbaProtectiveCub,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { flynnRiderSpectralScoundrel } from "@tcg/lorcana-cards/cards/010";

export const boostKeywordFixture = createFixture({
  id: "boost-keyword",
  name: "Boost Keyword",
  description: "Testing Boost keyword: pay ink to put top card of deck under character",
  skipPreGame: true,
  playerOne: {
    inkwell: 6,
    play: [flynnRiderSpectralScoundrel],
    deck: [mickeyMouseTrueFriend, simbaProtectiveCub, reflection, hakunaMatata],
  },
  playerTwo: {
    play: [{ card: stitchNewDog, exerted: true }],
    deck: [reflection, hakunaMatata],
  },
});
