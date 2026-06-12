import type { ItemCard } from "@tcg/lorcana-types";
import { cardSoldiersSpearI18n } from "./134-card-soldiers-spear.i18n";

export const cardSoldiersSpear: ItemCard = {
  id: "bi3",
  canonicalId: "ci_bi3",
  reprints: ["set6-134"],
  cardType: "item",
  name: "Card Soldier's Spear",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "006",
  cardNumber: 134,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b9c345526a994ae88d5832aac9f083b9",
    tcgPlayer: 588342,
  },
  text: [
    {
      title: "A SUITABLE WEAPON",
      description: "Your damaged characters get +1 {S}.",
    },
  ],
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "damaged",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "1ul-1",
      name: "A SUITABLE WEAPON",
      text: "A SUITABLE WEAPON Your damaged characters get +1 {S}.",
      type: "static",
    },
  ],
  i18n: cardSoldiersSpearI18n,
};
