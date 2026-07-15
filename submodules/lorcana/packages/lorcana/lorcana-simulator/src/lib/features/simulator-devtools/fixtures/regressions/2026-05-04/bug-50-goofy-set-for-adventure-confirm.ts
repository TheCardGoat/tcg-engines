import { goofySetForAdventure } from "@tcg/lorcana-cards/cards/009";
import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { fairyShipRoyalVessel } from "@tcg/lorcana-cards/cards/006";
import { createFixture } from "../../fixture-factory.js";

export const bug50GoofySetForAdventureConfirm = createFixture({
  id: "bug-50-goofy-set-for-adventure-confirm",
  name: "Bug 50 - Goofy Set for Adventure Confirm Stuck",
  description:
    "Goofy - Set for Adventure's FAMILY VACATION triggers when Goofy moves to a location: optionally move ANOTHER of your characters to THAT same location for free, then draw a card. The location is referenced via trigger-destination, not a fresh chooser. After selecting the second character to move, the confirm button stays disabled — the same family of bug as Transport Pod but driven by a trigger-destination ref instead of a free chooser. Setup: P1 has Goofy, Heihei (the OTHER character to move), and Fairy Ship - Royal Vessel in play. Sequence: move Goofy onto Fairy Ship (paying its move cost), accept Goofy's FAMILY VACATION optional, select Heihei, then check confirm. Bug: confirm does not enable. Correct: confirm enables, Heihei moves to Fairy Ship for free, and you draw 1 card.",
  playerOne: {
    play: [goofySetForAdventure, heiheiBoatSnack, fairyShipRoyalVessel],
    hand: [],
    inkwell: 5,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-50-goofy-set-for-adventure-confirm",
  skipPreGame: true,
});
