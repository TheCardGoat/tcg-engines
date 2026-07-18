import type { CharacterCard } from "@tcg/op-types";
import { op04Kyros082I18n } from "./082-kyros.i18n.ts";

export const op04Kyros082: CharacterCard = {
  id: "OP04-082",
  canonicalId: "OP04-082",
  slug: "kyros/op04-082",
  name: "Kyros",
  printings: [
    {
      id: "OP04-082",
      artId: "OP04-082",
      setCode: "OP04",
      collectorNumber: "082",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-082.jpg",
    },
    {
      id: "OP04-082_p1",
      artId: "OP04-082_p1",
      setCode: "OP04",
      collectorNumber: "082",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-082_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP04",
  cost: 3,
  power: 5000,
  traits: ["Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-082_p1.jpg",
      imageId: "OP04-082_p1",
    },
  ],
  effect:
    "If this Character would be K.O.'d, you may rest your Leader or 1 [Corrida Coliseum] instead. [On Play] If your Leader is [Rebecca], K.O. up to 1 of your opponent's Characters with a cost of 1 or less. Then, trash 1 card from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Rebecca",
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
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
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
            zones: ["leader", "stage"],
            count: {
              amount: 1,
            },
            filters: [
              {
                filter: "anyOf",
                groups: [
                  [
                    {
                      filter: "cardCategory",
                      value: "leader",
                    },
                  ],
                  [
                    {
                      filter: "cardCategory",
                      value: "stage",
                    },
                    {
                      filter: "name",
                      value: "Corrida Coliseum",
                    },
                  ],
                ],
              },
            ],
          },
        },
      },
    ],
  },
  i18n: op04Kyros082I18n,
};
