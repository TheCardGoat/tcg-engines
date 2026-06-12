import { simbaPrideProtector } from "@tcg/lorcana-cards/cards/006";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { heiheiBoatSnack, donaldDuckStruttingHisStuff } from "@tcg/lorcana-cards/cards/001";
import { chiefTuiProudOfMotunui } from "@tcg/lorcana-cards/cards/003";
import { createFixture } from "../../fixture-factory.js";

export const bug23SimbaPrideProtector = createFixture({
  id: "bug-23-simba-pride-protector",
  name: "Bug 23 – Simba, Pride Protector",
  description:
    "Simba – Pride Protector in play with a mix of own exerted and opposing exerted characters at end-of-turn to exercise the ready-on-end-of-turn trigger.",
  playerOne: {
    hand: [donaldDuckStruttingHisStuff],
    play: [
      simbaPrideProtector,
      { card: heiheiBoatSnack, exerted: true },
      { card: donaldDuckStruttingHisStuff, exerted: true },
    ],
    inkwell: 6,
    deck: [heiheiBoatSnack, peteBadGuy, chiefTuiProudOfMotunui],
  },
  playerTwo: {
    hand: [peteBadGuy],
    play: [
      { card: peteBadGuy, exerted: true },
      { card: chiefTuiProudOfMotunui, exerted: true },
    ],
    inkwell: 4,
    deck: [heiheiBoatSnack, donaldDuckStruttingHisStuff],
  },
  seed: "bug-23-simba-pride-protector",
  skipPreGame: true,
});
