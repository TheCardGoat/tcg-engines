import { hiroHamadaArmorDesigner, hiroHamadaFutureChampion } from "@tcg/lorcana-cards/cards/007";
import { hiroHamadaRoboticsProdigy } from "@tcg/lorcana-cards/cards/006";
import {
  donaldDuckStruttingHisStuff,
  heiheiBoatSnack,
  mickeyMouseArtfulRogue,
} from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../../fixture-factory.js";

export const bug28HiroHamadaArmorDesigner = createFixture({
  id: "bug-28-hiro-hamada-armor-designer",
  name: "Bug 28 – Hiro Hamada, Armor Designer",
  description:
    "Base Hiro Hamada in play for the active player with the Floodborn Hiro Hamada – Armor Designer in hand to shift; verify Evasive and Ward apply after shift completes.",
  playerOne: {
    hand: [hiroHamadaArmorDesigner, donaldDuckStruttingHisStuff],
    play: [
      hiroHamadaRoboticsProdigy,
      { card: mickeyMouseArtfulRogue, cardsUnder: [mickeyMouseArtfulRogue] },
    ],
    inkwell: 8,
    deck: [heiheiBoatSnack, peteBadGuy, donaldDuckStruttingHisStuff],
  },
  playerTwo: {
    hand: [peteBadGuy],
    inkwell: 4,
    deck: [heiheiBoatSnack, donaldDuckStruttingHisStuff],
  },
  seed: "bug-28-hiro-hamada-armor-designer",
  skipPreGame: true,
});
