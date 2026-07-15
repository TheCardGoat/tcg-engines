import { demonaScourgeOfTheWyvernClan } from "@tcg/lorcana-cards/cards/010";
import { royalGuardOctopusSoldier } from "@tcg/lorcana-cards/cards/008";
import { donaldDuckStruttingHisStuff, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../../fixture-factory.js";

export const bug29DemonaRoyalGuard = createFixture({
  id: "bug-29-demona-royal-guard",
  name: "Bug 29 – Demona / Royal Guard",
  description:
    "Demona – Scourge of the Wyvern Clan in play with Royal Guard – Octopus Soldier also in play and ready; exercise Demona's activated ability to draw and grant Challenger to the Royal Guard.",
  playerOne: {
    hand: [donaldDuckStruttingHisStuff, demonaScourgeOfTheWyvernClan],
    play: [demonaScourgeOfTheWyvernClan, royalGuardOctopusSoldier],
    inkwell: 6,
    deck: [heiheiBoatSnack, peteBadGuy, donaldDuckStruttingHisStuff],
  },
  playerTwo: {
    hand: [peteBadGuy],
    inkwell: 4,
    deck: [heiheiBoatSnack, donaldDuckStruttingHisStuff],
  },
  seed: "bug-29-demona-royal-guard",
  skipPreGame: true,
});
