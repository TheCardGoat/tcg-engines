import type { ActionCard } from "@tcg/lorcana-types";
import { strengthOfARagingFireI18n } from "./201-strength-of-a-raging-fire.i18n";

export const strengthOfARagingFire: ActionCard = {
  id: "rHN",
  canonicalId: "ci_s73",
  reprints: ["set2-201", "set9-201"],
  cardType: "action",
  name: "Strength of a Raging Fire",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "002",
  cardNumber: 201,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_0f4ad89d1f5348b0ae5b8d6010dc70d9",
    tcgPlayer: 647674,
  },
  text: "Deal damage to chosen character equal to the number of characters you have in play.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        amount: {
          controller: "you",
          type: "characters-in-play",
        },
        target: "CHOSEN_CHARACTER",
        type: "deal-damage",
      },
    },
  ],
  i18n: strengthOfARagingFireI18n,
};
