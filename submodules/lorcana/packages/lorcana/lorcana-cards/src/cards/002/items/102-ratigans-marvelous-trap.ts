import type { ItemCard } from "@tcg/lorcana-types";
import { ratigansMarvelousTrapI18n } from "./102-ratigans-marvelous-trap.i18n";

export const ratigansMarvelousTrap: ItemCard = {
  id: "Faq",
  canonicalId: "ci_Faq",
  reprints: ["set2-102"],
  cardType: "item",
  name: "Ratigan's Marvelous Trap",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 102,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_99154bf3bafd47f6ae3736da4cd5424f",
    tcgPlayer: 527245,
  },
  text: [
    {
      title: "SNAP! BOOM! TWANG!",
      description: "Banish this item — Each opponent loses 2 lore.",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        amount: 2,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "1wo-1",
      name: "SNAP! BOOM! TWANG!",
      text: "SNAP! BOOM! TWANG! Banish this item — Each opponent loses 2 lore.",
      type: "activated",
    },
  ],
  i18n: ratigansMarvelousTrapI18n,
};
