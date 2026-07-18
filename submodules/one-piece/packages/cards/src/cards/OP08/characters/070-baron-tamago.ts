import type { CharacterCard } from "@tcg/op-types";
import { op08BaronTamago070I18n } from "./070-baron-tamago.i18n.ts";

export const op08BaronTamago070: CharacterCard = {
  id: "OP08-070",
  canonicalId: "OP08-070",
  slug: "baron-tamago",
  name: "Baron Tamago",
  printings: [
    {
      id: "OP08-070",
      artId: "OP08-070",
      setCode: "OP08",
      collectorNumber: "070",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-070.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play up to 1 [Viscount Hiyoko] with a cost of 5 or less from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "name",
                value: "Viscount Hiyoko",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08BaronTamago070I18n,
};
