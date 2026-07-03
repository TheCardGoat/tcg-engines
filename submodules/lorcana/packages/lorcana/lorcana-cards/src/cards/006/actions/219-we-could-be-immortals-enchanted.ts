import type { ActionCard } from "@tcg/lorcana-types";
import { weCouldBeImmortalsEnchantedI18n } from "./219-we-could-be-immortals-enchanted.i18n";

export const weCouldBeImmortalsEnchanted: ActionCard = {
  id: "vrA",
  canonicalId: "ci_ABG",
  slug: "lorcana-ci_ABG",
  printings: [
    {
      id: "set6-219-enchanted",
      artId: "ci_ABG-enchanted",
      setCode: "set6",
      collectorNumber: "219",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set6-162"],
  cardType: "action",
  name: "We Could Be Immortals",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 219,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_c75fe9ce070a454696dd8d42c6931c68",
    tcgPlayer: "592012",
  },
  text: "Your Inventor characters gain Resist +6 this turn. Then, put this card into your inkwell facedown and exerted.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            keyword: "Resist",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "has-classification",
                  classification: "Inventor",
                },
              ],
            },
            type: "gain-keyword",
            value: 6,
          },
          {
            exerted: true,
            facedown: true,
            source: "this-card",
            target: "CONTROLLER",
            type: "put-into-inkwell",
          },
        ],
        type: "sequence",
      },
      id: "ulc-1",
      name: "Your Inventor",
      text: "Your Inventor characters gain Resist +6 this turn. Then, put this card into your inkwell facedown and exerted.",
      type: "action",
    },
  ],
  i18n: weCouldBeImmortalsEnchantedI18n,
};
