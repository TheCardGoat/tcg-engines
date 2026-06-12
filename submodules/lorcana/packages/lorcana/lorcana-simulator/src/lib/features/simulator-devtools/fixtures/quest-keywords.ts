import { createFixture } from "./fixture-factory";
import {
  arielSpectacularSinger,
  flounderVoiceOfReason,
  hakunaMatata,
  heiheiBoatSnack,
  mickeyMouseTrueFriend,
  reflection,
  simbaProtectiveCub,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { theFamilyMadrigal } from "@tcg/lorcana-cards/cards/007";
import { i2i } from "@tcg/lorcana-cards/cards/009";
import { shantiVillageGirl } from "@tcg/lorcana-cards/cards/010";

export const questKeywordsFixture = createFixture({
  id: "quest-keywords",
  name: "Quest Keywords",
  description: "Testing quest-related keywords: Support, Singer, Sing Together",
  skipPreGame: true,
  playerOne: {
    inkwell: 0,
    hand: [i2i, theFamilyMadrigal],
    play: [heiheiBoatSnack, arielSpectacularSinger, shantiVillageGirl, flounderVoiceOfReason],
    deck: [reflection, hakunaMatata, mickeyMouseTrueFriend, stitchNewDog, simbaProtectiveCub],
  },
  playerTwo: {
    play: [{ card: stitchNewDog, exerted: true }],
    deck: [reflection, hakunaMatata],
  },
});
