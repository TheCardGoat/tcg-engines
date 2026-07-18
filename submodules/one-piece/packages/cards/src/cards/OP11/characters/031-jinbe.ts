import type { CharacterCard } from "@tcg/op-types";
import { op11Jinbe031I18n } from "./031-jinbe.i18n.ts";

export const op11Jinbe031: CharacterCard = {
  id: "OP11-031",
  canonicalId: "OP11-031",
  slug: "jinbe/op11-031",
  name: "Jinbe",
  printings: [
    {
      id: "OP11-031",
      artId: "OP11-031",
      setCode: "OP11",
      collectorNumber: "031",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-031.jpg",
    },
    {
      id: "OP11-031_p1",
      artId: "OP11-031_p1",
      setCode: "OP11",
      collectorNumber: "031",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-031_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP11",
  cost: 6,
  power: 8000,
  traits: ["The Sun Pirates Merfolk Fish-Man Island"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-031_p1.jpg",
      imageId: "OP11-031_p1",
    },
  ],
  effect:
    '[On Play] If your Leader has the "Fish-Man" or "Merfolk" type, rest up to 1 of your opponent\'s Characters with a cost of 5 or less.\n[Activate: Main] [Once Per Turn] Up to 1 of your "Fish-Man" or "Merfolk" type Characters can attack Characters on the turn in which it is played.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Fish-Man",
                match: "includes",
              },
              {
                condition: "leaderTrait",
                trait: "Merfolk",
                match: "includes",
              },
            ],
          },
        ],
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
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "activateMain",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "anyOf",
                  filters: [
                    {
                      filter: "trait",
                      value: "Fish-Man",
                      match: "includes",
                    },
                    {
                      filter: "trait",
                      value: "Merfolk",
                      match: "includes",
                    },
                  ],
                },
              ],
            },
            keyword: "rushCharacter",
            duration: "permanent",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11Jinbe031I18n,
};
