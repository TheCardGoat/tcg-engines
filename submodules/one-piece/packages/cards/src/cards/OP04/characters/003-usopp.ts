import type { CharacterCard } from "@tcg/op-types";
import { op04Usopp003I18n } from "./003-usopp.i18n.ts";

export const op04Usopp003: CharacterCard = {
  id: "OP04-003",
  canonicalId: "OP04-003",
  slug: "usopp/op04-003",
  name: "Usopp",
  printings: [
    {
      id: "OP04-003",
      artId: "OP04-003",
      setCode: "OP04",
      collectorNumber: "003",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-003.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Alabasta Straw Hat Crew"],
  attribute: "wisdom",
  effect: "[On K.O.] K.O. up to 1 of your opponent's Characters with 5000 base power or less.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
                  filter: "basePower",
                  comparison: "lte",
                  value: 5000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04Usopp003I18n,
};
