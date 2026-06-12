import { luciferCunningCat } from "@tcg/lorcana-cards/cards/002";
import { brawl } from "@tcg/lorcana-cards/cards/004";
import {
  goofyMusketeer,
  heiheiBoatSnack,
  mickeyMouseTrueFriend,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "./fixture-factory";

export const triage20260505LuciferMouseCatcherFixture = createFixture({
  id: "triage-2026-05-05-lucifer-mouse-catcher",
  name: "Triage 2026-05-05 — Lucifer Cunning Cat MOUSE CATCHER (1 report)",
  description:
    "Player report: 'The bot is not discarding due the effect of Lucifer - Cunning Cat'. Repro: P1 plays Lucifer Cunning Cat. MOUSE CATCHER triggers a CHOICE prompt for the OPPONENT (P2) to either discard 2 cards OR discard 1 action card. Verify P2 receives a choice prompt and the resulting discard executes — vs. P2 in the digest replay where the bot silently passed without discarding.",
  skipPreGame: true,
  playerOne: {
    inkwell: 5,
    hand: [luciferCunningCat],
    play: [],
    deck: 5,
  },
  playerTwo: {
    inkwell: 5,
    hand: [brawl, goofyMusketeer, heiheiBoatSnack, mickeyMouseTrueFriend],
    play: [],
    deck: 5,
  },
});
