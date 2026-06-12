import type { ActionCard } from "@tcg/lorcana-types";
import { grabYourSwordI18n } from "./198-grab-your-sword.i18n";

export const grabYourSword: ActionCard = {
  id: "Sc6",
  canonicalId: "ci_Sc6",
  reprints: ["set1-198"],
  cardType: "action",
  name: "Grab Your Sword",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 198,
  rarity: "rare",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_48cd856a0632489c916bc354a3090cb2",
    tcgPlayer: 503469,
  },
  text: "Deal 2 damage to each opposing character.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 2,
        target: "ALL_OPPOSING_CHARACTERS",
        type: "deal-damage",
      },
    },
  ],
  i18n: grabYourSwordI18n,
};
