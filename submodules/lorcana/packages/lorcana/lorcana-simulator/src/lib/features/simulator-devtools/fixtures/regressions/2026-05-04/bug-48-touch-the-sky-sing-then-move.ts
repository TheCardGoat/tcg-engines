import { touchTheSky } from "@tcg/lorcana-cards/cards/012";
import { andysRoomHomeBase } from "@tcg/lorcana-cards/cards/012";
import { arielSpectacularSinger } from "@tcg/lorcana-cards/cards/001";
import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug48TouchTheSkySingThenMove = createFixture({
  id: "bug-48-touch-the-sky-sing-then-move",
  name: "Bug 48 - Touch the Sky sing-then-move prompt",
  description:
    "Touch the Sky (cost 2 song) reads: Move a character of yours to a location for free. Then, draw cards equal to that location's {L}. P1 has Ariel - Spectacular Singer (Singer 5, ready, dry) plus Mickey Mouse - True Friend (the character to move) and Andy's Room - Home Base (the destination location) in play. Touch the Sky is in P1's hand. Repro steps: (1) sing Touch the Sky by exerting Ariel as a Singer; (2) the move-to-location step should prompt for a character of yours, then for a location. Bug: when sung via the alt-cost Singer path, the move-to-location selection prompt does not appear and/or the confirm button never activates. Correct behavior: both selection prompts appear, the confirm button enables once a valid character + location pair is chosen, the character moves for free, and P1 draws cards equal to the location's lore.",
  playerOne: {
    play: [
      { card: arielSpectacularSinger, isDrying: false },
      { card: mickeyMouseTrueFriend, isDrying: false },
      { card: andysRoomHomeBase },
    ],
    hand: [touchTheSky],
    inkwell: 5,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-48-touch-the-sky-sing-then-move",
  skipPreGame: true,
});
