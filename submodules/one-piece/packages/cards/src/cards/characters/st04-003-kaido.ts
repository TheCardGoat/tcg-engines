import type { CharacterCard } from "@tcg/op-types";
import { prb01Kaido003I18n } from "./st04-003-kaido.i18n.ts";

export const prb01Kaido003: CharacterCard = {
  id: "ST04-003",
  canonicalId: "ST04-003",
  slug: "kaido/st04-003",
  name: "Kaido",
  printings: [
    {
      id: "ST04-003",
      artId: "ST04-003",
      setCode: "ST04",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-003_r1.png",
    },
    {
      id: "ST04-003_p1",
      artId: "ST04-003_p1",
      setCode: "ST04",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-003_p1.jpg",
    },
    {
      id: "ST04-003_p4",
      artId: "ST04-003_p4",
      setCode: "ST04",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-003_p4.jpg",
      label: "Kaido (ST04-003) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "ST04",
  cost: 9,
  power: 10000,
  traits: ["The Four Emperors", "Animal Kingdom Pirates"],
  attribute: "strike",

  effect:
    "[On Play] DON!! -5 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 6 or less. This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 5,
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
                  value: 6,
                },
              ],
            },
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01Kaido003I18n,
};
