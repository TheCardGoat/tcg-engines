import { mauiHalfshark, skullRockIsolatedFortress } from "@tcg/lorcana-cards/cards/006";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import {
  donaldDuckStruttingHisStuff,
  heiheiBoatSnack,
  ransack,
  partOfYourWorld,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug24MauiHalfShark = createFixture({
  id: "bug-24-maui-half-shark",
  name: "Bug 24 – Maui, Half-Shark",
  description:
    "Maui – Half-Shark in play with a mix of characters and action cards in own discard, plus an opposing location to challenge.",
  playerOne: {
    hand: [],
    play: [mauiHalfshark],
    inkwell: 8,
    deck: [donaldDuckStruttingHisStuff, peteBadGuy],
    discard: [donaldDuckStruttingHisStuff, heiheiBoatSnack, ransack, partOfYourWorld, peteBadGuy],
  },
  playerTwo: {
    hand: [peteBadGuy],
    play: [skullRockIsolatedFortress, { card: heiheiBoatSnack, exerted: true }],
    inkwell: 4,
    deck: [heiheiBoatSnack, donaldDuckStruttingHisStuff],
  },
  seed: "bug-24-maui-half-shark",
  skipPreGame: true,
});
