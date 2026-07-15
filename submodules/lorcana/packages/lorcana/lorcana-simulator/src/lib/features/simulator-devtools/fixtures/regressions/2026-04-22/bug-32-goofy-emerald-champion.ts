import {
  goofyEmeraldChampion,
  littleJohnImpermanentOutlaw,
  akelaForestRunner,
} from "@tcg/lorcana-cards/cards/010";
import { simbaPrideProtector } from "@tcg/lorcana-cards/cards/006";
import { donaldDuckStruttingHisStuff, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../../fixture-factory.js";

export const bug32GoofyEmeraldChampion = createFixture({
  id: "bug-32-goofy-emerald-champion",
  name: "Bug 32 – Goofy, Emerald Champion",
  description:
    "Goofy – Emerald Champion in play alongside multiple Emerald friendlies plus a non-Emerald friendly to confirm Ward scoping applies only to Emerald characters.",
  playerOne: {
    hand: [donaldDuckStruttingHisStuff],
    play: [
      goofyEmeraldChampion,
      littleJohnImpermanentOutlaw,
      akelaForestRunner,
      simbaPrideProtector,
    ],
    inkwell: 8,
    deck: [heiheiBoatSnack, peteBadGuy, donaldDuckStruttingHisStuff],
  },
  playerTwo: {
    hand: [peteBadGuy, donaldDuckStruttingHisStuff],
    inkwell: 5,
    deck: [heiheiBoatSnack, donaldDuckStruttingHisStuff],
  },
  seed: "bug-32-goofy-emerald-champion",
  skipPreGame: true,
});
