import type { CharacterCard } from "@tcg/op-types";
import { op16Mr1DazBonez054I18n } from "./op16-054-mr-1-daz-bonez.i18n.ts";

export const op16Mr1DazBonez054: CharacterCard = {
  id: "OP16-054",
  canonicalId: "OP16-054",
  slug: "mr-1-daz-bonez/op16-054",
  name: "Mr.1(Daz.Bonez)",
  printings: [
    {
      id: "OP16-054",
      artId: "OP16-054",
      setCode: "OP16",
      collectorNumber: "054",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-054_HqcTLyT.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP16",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Impel Down Former Baroque Works"],
  attribute: "slash",
  effect:
    "[DON!! X1] [Your Turn] If you have 5 or more cards in your hand, this Character gains +3000 power.\n\n[On Play] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "handCount",
            player: "self",
            comparison: "gte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op16Mr1DazBonez054I18n,
};
