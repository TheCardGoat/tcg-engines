import { rollerBobSidsToy } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const bug63RollerBobNoToys = createFixture({
  id: "bug-63-roller-bob-no-toys",
  name: "Bug 63 - Roller Bob TIME TO MOVE cannot be skipped with empty discard",
  description:
    "Roller Bob - Sid's Toy (cost 3) has TIME TO MOVE: 'When you play this character, you may put 2 character cards from your discard on the bottom of your deck to give this character Rush this turn.' P1 has Roller Bob in hand and 3 ink to play him. P1's discard is empty, so there are no characters available to put on the bottom of the deck. Bug: the optional cannot be declined / it forces the put-on-bottom step even though there are zero legal cards, leaving the trigger stuck. Correct behavior: the player can decline the optional, OR the inner sequence auto-fails cleanly when fewer than 2 valid characters exist in discard, and play resumes.",
  playerOne: {
    play: [],
    hand: [rollerBobSidsToy],
    discard: [],
    inkwell: 3,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-63-roller-bob-no-toys",
  skipPreGame: true,
});
