import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Megalo018I18n } from "./018-megalo.i18n.ts";

export const op14eb04Megalo018: CharacterCard = {
  id: "EB04-018",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Animal Fish-Man Island"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-018_p1_xWf2jlX.jpg",
      imageId: "EB04-018_p1",
    },
  ],
  effect:
    "[On Play] You may rest this Character: K.O. up to 1 of your opponent's rested Characters with 8000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restThisCard",
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "power",
                  comparison: "lte",
                  value: 8000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04Megalo018I18n,
};
