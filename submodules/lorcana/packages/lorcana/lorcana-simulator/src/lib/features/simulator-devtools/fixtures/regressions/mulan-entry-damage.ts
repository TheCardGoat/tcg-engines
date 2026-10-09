import { mickeyMouseBraveLittleTailor } from "@tcg/lorcana-cards/cards/001";
import { mulanInjuredSoldier } from "@tcg/lorcana-cards/cards/009";
import { createFixture } from "../fixture-factory.js";

export const mulanEntryDamageRegression = createFixture({
  id: "mulan-entry-damage",
  name: "Mulan - Self-only entry damage",
  description: "Play Mickey Mouse while an opposing Mulan is in play. Mickey must enter undamaged.",
  playerOne: {
    hand: [mickeyMouseBraveLittleTailor],
    inkwell: 8,
    deck: [mickeyMouseBraveLittleTailor],
  },
  playerTwo: {
    play: [{ card: mulanInjuredSoldier, damage: 2 }],
    deck: [mulanInjuredSoldier],
  },
  seed: "mulan-entry-damage",
  skipPreGame: true,
});
