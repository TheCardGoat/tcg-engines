import {
  chiefTuiRespectedLeader,
  goofyMusketeer,
  mickeyMouseTrueFriend,
} from "@tcg/lorcana-cards/cards/001";
import { theFamilyScattered } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260514TheFamilyScatteredFixture = createFixture({
  id: "triage-2026-05-14-the-family-scattered",
  name: "Triage 2026-05-14 - The Family Scattered three destinations",
  description:
    "Visual repro for digest reports #14/#18. Cast The Family Scattered targeting player two. Expected: player two chooses three of their characters across the grouped resolution, then one returns to hand, one goes to bottom of deck, and one goes to top of deck. The action should not stop after processing only one character.",
  skipPreGame: true,
  playerOne: {
    inkwell: theFamilyScattered.cost,
    hand: [theFamilyScattered],
    play: [],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: mickeyMouseTrueFriend, isDrying: false },
      { card: goofyMusketeer, isDrying: false },
      { card: chiefTuiRespectedLeader, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-the-family-scattered",
});
