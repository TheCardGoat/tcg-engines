import type { CharacterCard } from "@tcg/op-types";
import { op03Marco013I18n } from "./013-marco.i18n.ts";

export const op03Marco013: CharacterCard = {
  id: "OP03-013",
  canonicalId: "OP03-013",
  slug: "marco/op03-013",
  name: "Marco",
  printings: [
    {
      id: "OP03-013",
      artId: "OP03-013",
      setCode: "OP03",
      collectorNumber: "013",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-013.jpg",
    },
    {
      id: "OP03-013_p1",
      artId: "OP03-013_p1",
      setCode: "OP03",
      collectorNumber: "013",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-013_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-013_p1.jpg",
      imageId: "OP03-013_p1",
    },
  ],
  effect:
    "[Your Turn] [On Play] K.O. up to 1 of your opponent's Characters with 3000 power or less.\n[On K.O.] You may trash 1 Event from your hand: You may play this Character card from your trash rested.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
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
                  filter: "power",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "onKo",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
            },
            self: true,
            playState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03Marco013I18n,
};
