import { touchTheSky } from "@tcg/lorcana-cards/cards/012";
import { andysRoomHomeBase, pizzaPlanetSpaceport } from "@tcg/lorcana-cards/cards/012";
import { goofyMusketeer, mulanImperialSoldier } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "./fixture-factory";

export const triage20260505TouchTheSkyFixture = createFixture({
  id: "triage-2026-05-05-touch-the-sky",
  name: "Triage 2026-05-05 — Touch the Sky (2 reports)",
  description:
    "Player reports: 'would not allow me to choose character to move to which location or confirm'. Repro: play Touch the Sky from hand, then pick a character + a location — both target slots must prompt and confirm.",
  skipPreGame: true,
  playerOne: {
    inkwell: 5,
    hand: [touchTheSky],
    play: [
      { card: goofyMusketeer, isDrying: false },
      { card: mulanImperialSoldier, isDrying: false },
      pizzaPlanetSpaceport,
      andysRoomHomeBase,
    ],
    deck: 5,
  },
  playerTwo: {
    inkwell: 5,
    hand: [],
    play: [],
    deck: 5,
  },
});
