import { woodyJungleGuide } from "@tcg/lorcana-cards/cards/012";
import { rexProtectiveDinosaur } from "@tcg/lorcana-cards/cards/012";
import { hammPiggyBank } from "@tcg/lorcana-cards/cards/012";
import { alienTrueBeliever } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const bug46WoodyJungleGuideOptionalPlay = createFixture({
  id: "bug-46-woody-jungle-guide-optional-play",
  name: "Bug 46 - Woody Jungle Guide Optional Play",
  description:
    "Woody Jungle Guide has a 'may' ability when questing: draw a card, then you MAY play a character with cost 2 or less for free. The player should be prompted to choose whether to play and which character to play. Multiple eligible targets in hand (Rex, Hamm, Alien) test the selection prompt. Rex with Bodyguard also tests whether the played character is correctly drying (cannot exert on the same turn).",
  playerOne: {
    play: [{ card: woodyJungleGuide }],
    hand: [],
    // hand: [rexProtectiveDinosaur, hammPiggyBank, alienTrueBeliever],
    // inkwell: 5,
    deck: [rexProtectiveDinosaur],
    // deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-46-woody-jungle-guide-optional-play",
  skipPreGame: true,
});
