import { heiheiBoatSnack, minnieMouseAlwaysClassy } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy, theNokkWaterSpirit } from "@tcg/lorcana-cards/cards/002";
import { faZhouWarHero } from "@tcg/lorcana-cards/cards/007";
import { createFixture } from "../../fixture-factory.js";
import { donaldDuckBuccaneer, mulanArmoredFighter } from "@tcg/lorcana-cards/cards/004";
import { mushuBragginDragon } from "@tcg/lorcana-cards/cards/010";

export const bug20FaZhouWarHero = createFixture({
  id: "bug-20-fa-zhou-war-hero",
  name: "Bug 20 - Fa Zhou, War Hero",
  description:
    "Fa Zhou in play ready to challenge. Opponent controls two characters and one location for challenge target options.",
  playerOne: {
    play: [faZhouWarHero, mulanArmoredFighter, mushuBragginDragon, heiheiBoatSnack],
    hand: [heiheiBoatSnack],
    inkwell: 6,
    deck: [heiheiBoatSnack, heiheiBoatSnack, heiheiBoatSnack],
  },
  playerTwo: {
    play: [
      { card: minnieMouseAlwaysClassy, exerted: true },
      { card: donaldDuckBuccaneer, exerted: true },
      { card: theNokkWaterSpirit, exerted: true },
    ],
    deck: [peteBadGuy, peteBadGuy, peteBadGuy],
  },
  seed: "bug-20-fa-zhou-war-hero",
  skipPreGame: true,
});
