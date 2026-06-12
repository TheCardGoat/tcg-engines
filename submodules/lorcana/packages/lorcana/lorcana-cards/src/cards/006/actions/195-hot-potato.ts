import type { ActionCard } from "@tcg/lorcana-types";
import { hotPotatoI18n } from "./195-hot-potato.i18n";

export const hotPotato: ActionCard = {
  id: "7Fa",
  canonicalId: "ci_7Fa",
  reprints: ["set6-195"],
  cardType: "action",
  name: "Hot Potato",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 195,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_ab3a202cb90a43beac5943ac4baad67a",
    tcgPlayer: 578234,
  },
  text: "Choose one:\n- Deal 2 damage to chosen character.\n- Banish chosen item.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "choice",
        options: [
          {
            type: "deal-damage",
            amount: 2,
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "banish",
            target: "CHOSEN_ITEM",
          },
        ],
      },
    },
  ],
  i18n: hotPotatoI18n,
};
