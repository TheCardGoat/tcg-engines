import type { CharacterCard } from "@tcg/op-types";
import { op11Fukaboshi110I18n } from "./110-fukaboshi.i18n.ts";

export const op11Fukaboshi110: CharacterCard = {
  id: "OP11-110",
  canonicalId: "OP11-110",
  slug: "fukaboshi",
  name: "Fukaboshi",
  printings: [
    {
      id: "OP11-110",
      artId: "OP11-110",
      setCode: "OP11",
      collectorNumber: "110",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-110.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  power: 5000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "slash",
  effect:
    "If this Character would be K.O.'d, you may rest 1 of your [Fish-Man Island] or your [Shirahoshi] Leader instead.\n[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: K.O. up to 1 of your opponent's Characters with a cost of 1 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["leader"],
            count: {
              amount: 1,
            },
            filters: [
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Fish-Man Island",
                    match: "includes",
                  },
                  {
                    filter: "name",
                    value: "Shirahoshi",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  i18n: op11Fukaboshi110I18n,
};
