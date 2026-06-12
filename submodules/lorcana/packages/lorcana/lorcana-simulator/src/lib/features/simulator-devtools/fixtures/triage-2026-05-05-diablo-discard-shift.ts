import { brawl, diabloDevotedHerald, diabloMaleficentsSpy } from "@tcg/lorcana-cards/cards/004";
import { youHaveForgottenMe } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "./fixture-factory";

export const triage20260505DiabloDiscardShiftFixture = createFixture({
  id: "triage-2026-05-05-diablo-discard-shift",
  name: "Triage 2026-05-05 — Diablo Devoted Herald discard-shift (2 reports)",
  description:
    "Player reports: 'Can't shift Diablo even though I have \"You Have Forgotten Me\" in hand to discard'. Repro: shift Diablo Devoted Herald onto Diablo Maleficent's Spy, paying the alt cost by discarding an action card from hand (You Have Forgotten Me or Brawl).",
  skipPreGame: true,
  playerOne: {
    inkwell: 0,
    hand: [diabloDevotedHerald, youHaveForgottenMe, brawl],
    play: [{ card: diabloMaleficentsSpy, isDrying: false }],
    deck: 5,
  },
  playerTwo: {
    inkwell: 5,
    hand: [],
    play: [],
    deck: 5,
  },
});
