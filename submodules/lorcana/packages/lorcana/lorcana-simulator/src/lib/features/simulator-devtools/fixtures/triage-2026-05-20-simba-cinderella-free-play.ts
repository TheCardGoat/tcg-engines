import { mickeyMouseTrueFriend, reflection, stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { simbaKingInTheMaking } from "@tcg/lorcana-cards/cards/010";
import { cinderellaResourcefulTraveler } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260520SimbaCinderellaFreePlayFixture = createFixture({
  id: "triage-2026-05-20-simba-cinderella-free-play",
  name: "Triage 2026-05-20 - Simba + Cinderella free play",
  description:
    "Visual validation for Cinderella - Resourceful Traveler after Simba - King in the Making plays a character for free. Activate Simba's Boost 3. Resolve TIMELY ALLIANCE by playing Mickey Mouse - True Friend from the revealed deck top. Then quest with Cinderella. Her THIS AND THAT optional prompt should appear and let you put Stitch - New Dog from the top of your deck into your inkwell facedown and exerted.",
  skipPreGame: true,
  playerOne: {
    inkwell: 3,
    hand: [],
    play: [
      { card: simbaKingInTheMaking, isDrying: false },
      { card: cinderellaResourcefulTraveler, isDrying: false },
    ],
    deck: [stitchNewDog, mickeyMouseTrueFriend, reflection],
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 5,
    lore: 0,
  },
  seed: "triage-2026-05-20-simba-cinderella-free-play",
});
