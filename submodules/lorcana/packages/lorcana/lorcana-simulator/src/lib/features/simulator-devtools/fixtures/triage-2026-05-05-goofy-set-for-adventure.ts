import { goofySetForAdventure } from "@tcg/lorcana-cards/cards/009";
import { andysRoomHomeBase, pizzaPlanetSpaceport } from "@tcg/lorcana-cards/cards/012";
import { goofyMusketeer } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "./fixture-factory";

export const triage20260505GoofySetForAdventureFixture = createFixture({
  id: "triage-2026-05-05-goofy-set-for-adventure",
  name: "Triage 2026-05-05 — Goofy Set for Adventure (4 reports)",
  description:
    "Player reports: 'lets me select a character to move but won't let me actually move them to the location'. Repro: move Goofy to Pizza Planet, then on the Family Vacation trigger choose Goofy Musketeer — verify the Musketeer relocates and you draw a card.",
  skipPreGame: true,
  playerOne: {
    inkwell: 5,
    hand: [],
    play: [
      { card: goofySetForAdventure, isDrying: false },
      { card: goofyMusketeer, isDrying: false },
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
