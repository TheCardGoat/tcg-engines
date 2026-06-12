import { belleStrangeButSpecial, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { goofyKnightForADay, peteBadGuy, theNokkWaterSpirit } from "@tcg/lorcana-cards/cards/002";
import { chiefTuiProudOfMotunui } from "@tcg/lorcana-cards/cards/003";
import { mulanReadyForBattle } from "@tcg/lorcana-cards/cards/011";
import { createFixture } from "../../fixture-factory.js";

export const bug21MulanReadyForBattle = createFixture({
  id: "bug-21-mulan-ready-for-battle",
  name: "Bug 21 - Mulan, Ready For Battle",
  description:
    "Mulan in hand. Several damaged characters and strength-5+ characters (The Nokk) in play to exercise cost-reduction paths.",
  playerOne: {
    hand: [mulanReadyForBattle, heiheiBoatSnack],
    play: [
      { card: belleStrangeButSpecial, damage: 2 },
      { card: chiefTuiProudOfMotunui, damage: 1 },
      goofyKnightForADay,
      theNokkWaterSpirit,
    ],
    inkwell: 10,
    deck: [heiheiBoatSnack, heiheiBoatSnack, heiheiBoatSnack],
  },
  playerTwo: {
    play: [peteBadGuy],
    deck: [peteBadGuy, peteBadGuy, peteBadGuy],
  },
  seed: "bug-21-mulan-ready-for-battle",
  skipPreGame: true,
});
