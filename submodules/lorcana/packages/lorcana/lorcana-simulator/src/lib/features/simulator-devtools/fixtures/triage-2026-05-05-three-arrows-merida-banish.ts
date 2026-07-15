import { annaHeirToArendelle, goofyMusketeer } from "@tcg/lorcana-cards/cards/001";
import { meridaFormidableArcher, threeArrows } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";
import { mosquitoBite } from "@tcg/lorcana-cards/cards/006";

export const triage20260505ThreeArrowsMeridaBanishFixture = createFixture({
  id: "triage-2026-05-05-three-arrows-merida-banish",
  name: "Triage 2026-05-05 — Three Arrows + Merida banish (1 report)",
  description:
    "Player report: 'After playing Three Arrows with Merida in play, the two damage counters from Three Arrows show on the characters banished after Merida's trigger resolves.' Repro: P1 plays Three Arrows on Anna (willpower 4). Three Arrows deals 2 damage → STEADY AIM (Merida Formidable Archer) deals 2 more → Anna is banished. Verify no damage counters render on the banished card after the bag drains. Optional second target: deal 1 to Goofy → STEADY AIM adds 2 → Goofy at 3/4 willpower, still in play.",
  skipPreGame: true,
  playerOne: {
    inkwell: 5,
    hand: [threeArrows, mosquitoBite],
    play: [{ card: meridaFormidableArcher, isDrying: false }],
    deck: 5,
  },
  playerTwo: {
    inkwell: 5,
    hand: [],
    play: [
      { card: annaHeirToArendelle, isDrying: false },
      { card: goofyMusketeer, isDrying: false },
    ],
    deck: 5,
  },
});
