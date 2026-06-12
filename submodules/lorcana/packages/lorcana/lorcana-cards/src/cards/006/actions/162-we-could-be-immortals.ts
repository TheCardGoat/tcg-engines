import type { ActionCard } from "@tcg/lorcana-types";
import { weCouldBeImmortalsI18n } from "./162-we-could-be-immortals.i18n";

export const weCouldBeImmortals: ActionCard = {
  id: "Q0V",
  canonicalId: "ci_ABG",
  reprints: ["set6-162"],
  cardType: "action",
  name: "We Could Be Immortals",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 162,
  rarity: "rare",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_c75fe9ce070a454696dd8d42c6931c68",
    tcgPlayer: 592012,
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
  i18n: weCouldBeImmortalsI18n,
};
