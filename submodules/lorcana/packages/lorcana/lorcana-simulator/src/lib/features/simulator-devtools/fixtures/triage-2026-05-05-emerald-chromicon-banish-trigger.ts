import { goofyMusketeer, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { emeraldChromicon } from "@tcg/lorcana-cards/cards/005";
import { createFixture } from "./fixture-factory";

export const triage20260505EmeraldChromiconBanishTriggerFixture = createFixture({
  id: "triage-2026-05-05-emerald-chromicon-banish-trigger",
  name: "Triage 2026-05-05 — Emerald Chromicon EMERALD LIGHT (1 report)",
  description:
    "Player report: 'rarely triggers its ability for the player, but consistently triggers for the Practice AI'. Repro: P1 owns Emerald Chromicon and an exerted 1-willpower character (Heihei). On P2's turn, P2 challenges the exerted Heihei with Goofy Musketeer (str 2) — Heihei is banished during P2's turn → EMERALD LIGHT must add an optional bag entry on P1's side to return chosen character to its owner's hand. Heihei starts exerted because Lorcana's challenge rules require the defender to be exerted (CRD 4.3.4); without that the challenge cannot legally start.",
  skipPreGame: true,
  playerOne: {
    inkwell: 3,
    hand: [],
    play: [emeraldChromicon, { card: heiheiBoatSnack, isDrying: false, exerted: true }],
    deck: 5,
  },
  playerTwo: {
    inkwell: 3,
    hand: [],
    play: [{ card: goofyMusketeer, isDrying: false, exerted: false }],
    deck: 5,
  },
});
