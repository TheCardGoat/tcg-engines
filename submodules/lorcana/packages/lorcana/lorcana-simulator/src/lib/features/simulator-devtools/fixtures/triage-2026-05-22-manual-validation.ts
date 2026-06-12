import { friendsOnTheOtherSide } from "@tcg/lorcana-cards/cards/001";
import { underTheSea } from "@tcg/lorcana-cards/cards/004";
import { liquidatorIcedOver } from "@tcg/lorcana-cards/cards/011";
import { windupFrogSidsToy, woodyJungleGuide } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260522WoodyUnderTheSeaToyFollowupFixture = createFixture({
  id: "triage-2026-05-22-woody-under-the-sea-toy-followup",
  name: "Triage 2026-05-22 - Woody Under the Sea Toy follow-up",
  description:
    "Replay mgIWIBbVtg8QePn6QTO6uDj turn 11 visual validation. P2 controls Woody - Jungle Guide and a damaged Wind-Up Frog - Sid's Toy. Woody's static +1 willpower keeps the 1-base-willpower Toy alive before Under the Sea resolves. P1 casts Under the Sea. Expected: Under the Sea moves Woody and the damaged low-strength Toy at the same time. Capture before/after board state and exact card instance IDs if any damaged 1-base-willpower Toy remains in play after Woody leaves.",
  skipPreGame: true,
  playerOne: {
    hand: [underTheSea],
    inkwell: underTheSea.cost,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: woodyJungleGuide, isDrying: false },
      { card: windupFrogSidsToy, isDrying: false, damage: 1 },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-22-woody-under-the-sea-toy-followup",
});

export const triage20260522LiquidatorTurnOneExpectationFixture = createFixture({
  id: "triage-2026-05-22-liquidator-turn-one-expectation",
  name: "Triage 2026-05-22 - Liquidator turn-one expectation",
  description:
    "Replay mgYDIn-sWpq2j3KQ4Dm3y6J turn 1 rules-expectation validation. P1 has only 1 ink and Liquidator - Iced Over in hand on the first player's turn. Expected: no legal play affordance appears because Liquidator costs 2 and UNDERDOG does not apply to the first player. If the simulator offers a free-play or alternative-cost path, capture the available move and open a targeted issue.",
  skipPreGame: true,
  playerOne: {
    hand: [liquidatorIcedOver],
    inkwell: 1,
    deck: [friendsOnTheOtherSide],
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-22-liquidator-turn-one-expectation",
});
