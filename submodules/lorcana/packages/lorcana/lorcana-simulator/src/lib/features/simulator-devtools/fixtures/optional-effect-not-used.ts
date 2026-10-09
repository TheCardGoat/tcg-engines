import { maxGoofRebelliousTeen, strengthOfARagingFire } from "@tcg/lorcana-cards/cards/009";
import { createFixture } from "./fixture-factory";

export const optionalEffectNotUsedFixture = createFixture({
  id: "optional-effect-not-used",
  name: "Optional effect without payment",
  description:
    "Play Max Goof with exactly three ready ink. His extra one-ink payment is unavailable. The log must say the optional effect was not used, without claiming the player chose No.",
  skipPreGame: true,
  playerOne: {
    inkwell: 3,
    hand: [maxGoofRebelliousTeen],
    discard: [strengthOfARagingFire],
    deck: 10,
    lore: 0,
  },
  playerTwo: { deck: 10, lore: 0 },
  seed: "optional-effect-not-used",
});
