import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Mr1DazBonez090I18n } from "./090-mr-1-daz-bonez.i18n.ts";

export const op14eb04Mr1DazBonez090: CharacterCard = {
  id: "OP14-090",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-090_p1_iZtQpaV.jpg",
      imageId: "OP14-090_p1",
    },
  ],
  effect:
    "If there is a Character with a cost of 0 or with a cost of 8 or more, this Character can attack Characters on the turn in which it is played.\n[On Play] Rest up to 1 of your opponent's Characters with a cost of 0.",
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
              filters: [
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Mr1DazBonez090I18n,
};
