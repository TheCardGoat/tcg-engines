import type { CharacterCard } from "@tcg/op-types";
import { op11FisherTiger035I18n } from "./035-fisher-tiger.i18n.ts";

export const op11FisherTiger035: CharacterCard = {
  id: "OP11-035",
  canonicalId: "OP11-035",
  slug: "fisher-tiger/op11-035",
  name: "Fisher Tiger",
  printings: [
    {
      id: "OP11-035",
      artId: "OP11-035",
      setCode: "OP11",
      collectorNumber: "035",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-035.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP11",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Fish-Man The Sun Pirates Fish-Man Island"],
  attribute: "strike",
  effect:
    'When this Character is K.O.\'d by your opponent\'s effect, you may rest 1 of your DON!! cards. If you do, play up to 1 "Fish-Man" or "Merfolk" type Character card with a cost of 4 or less from your hand.\n[On Play] Rest up to 1 of your opponent\'s Characters.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op11FisherTiger035I18n,
};
