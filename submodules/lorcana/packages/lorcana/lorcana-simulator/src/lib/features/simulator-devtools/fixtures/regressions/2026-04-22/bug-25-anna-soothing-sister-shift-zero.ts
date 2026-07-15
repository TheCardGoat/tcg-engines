import { annaSoothingSister, annaLittleSister } from "@tcg/lorcana-cards/cards/011";
import {
  donaldDuckStruttingHisStuff,
  heiheiBoatSnack,
  partOfYourWorld,
  ransack,
} from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../../fixture-factory.js";

export const bug25AnnaSoothingSisterShiftZero = createFixture({
  id: "bug-25-anna-soothing-sister-shift-zero",
  name: "Bug 25 – Anna, Soothing Sister (Shift 0)",
  description:
    "Anna – Little Sister in play and Anna – Soothing Sister in hand to shift for 0 after a card left discard this turn. Opponent holds cards to support any targeting follow-ups.",
  playerOne: {
    hand: [annaSoothingSister, partOfYourWorld],
    play: [annaLittleSister],
    inkwell: 5,
    deck: [donaldDuckStruttingHisStuff, heiheiBoatSnack, peteBadGuy],
    discard: [ransack, donaldDuckStruttingHisStuff],
  },
  playerTwo: {
    hand: [donaldDuckStruttingHisStuff, heiheiBoatSnack, peteBadGuy, partOfYourWorld],
    inkwell: 4,
    deck: [peteBadGuy, heiheiBoatSnack],
  },
  seed: "bug-25-anna-soothing-sister-shift-zero",
  skipPreGame: true,
});
