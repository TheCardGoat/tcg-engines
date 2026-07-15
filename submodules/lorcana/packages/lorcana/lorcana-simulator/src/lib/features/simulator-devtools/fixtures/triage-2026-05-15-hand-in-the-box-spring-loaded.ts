import { handintheboxSidsToy, windupFrogSidsToy } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260515HandInTheBoxSpringLoadedFixture = createFixture({
  id: "triage-2026-05-15-hand-in-the-box-spring-loaded",
  name: "Triage 2026-05-15 - Hand-in-the-Box SPRING-LOADED",
  description:
    "Visual repro for Hand-in-the-Box - Sid's Toy SPRING-LOADED. P1 has Hand-in-the-Box in hand, zero ink, and Wind-Up Frog - Sid's Toy in discard. The hand action should let P1 choose the Toy from discard and play Hand-in-the-Box for free.",
  skipPreGame: true,
  playerOne: {
    inkwell: 0,
    hand: [handintheboxSidsToy],
    discard: [windupFrogSidsToy],
    deck: 5,
    lore: 0,
  },
  playerTwo: {
    inkwell: 0,
    hand: [],
    play: [],
    deck: 5,
    lore: 0,
  },
  seed: "triage-2026-05-15-hand-in-the-box-spring-loaded",
});
