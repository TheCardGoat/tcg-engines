import type { ActionCard } from "@tcg/lorcana-types";
import { waterHasMemoryI18n } from "./177-water-has-memory.i18n";

export const waterHasMemory: ActionCard = {
  id: "mVr",
  canonicalId: "ci_mVr",
  reprints: ["set7-177"],
  cardType: "action",
  name: "Water Has Memory",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "007",
  cardNumber: 177,
  rarity: "common",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_63c20a20927a4cb1b67736648b2867c8",
    tcgPlayer: 618722,
  },
  text: "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
  abilities: [
    {
      effect: {
        amount: 4,
        destinations: [
          {
            max: 1,
            zone: "deck-top",
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
        target: "CHOSEN_PLAYER",
        type: "scry",
      },
      id: "q8v-1",
      text: "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
      type: "action",
    },
  ],
  i18n: waterHasMemoryI18n,
};
