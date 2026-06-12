import { annaSoothingSister } from "@tcg/lorcana-cards/cards/011";
import { grandmotherFaSpiritedElder } from "@tcg/lorcana-cards/cards/007";
import { createFixture } from "../../fixture-factory.js";

export const bug55AnnaSoothingSisterWarmHeart = createFixture({
  id: "bug-55-anna-soothing-sister-warm-heart",
  name: "Bug 55 - Anna Soothing Sister WARM HEART step order",
  description:
    "P1 has Anna - Soothing Sister ready to quest, with Grandmother Fa - Spirited Elder (2 {L}) sitting in P1's discard. Quest with Anna, accept the optional WARM HEART, choose Grandmother Fa from discard, and check the lore counter. Bug: the gain-lore step runs before the select-target step in the ability sequence, so the chosen card's lore is not yet bound — P1 gains 0 lore instead of 2. Correct behavior: P1 gains 2 lore (matching Grandmother Fa's printed {L}) and the chosen card is sent to the bottom of the deck.",
  playerOne: {
    play: [{ card: annaSoothingSister, isDrying: false }],
    hand: [],
    discard: [grandmotherFaSpiritedElder],
    inkwell: 5,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-55-anna-soothing-sister-warm-heart",
  skipPreGame: true,
});
