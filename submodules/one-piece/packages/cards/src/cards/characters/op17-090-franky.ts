import type { CharacterCard } from "@tcg/op-types";
import { op17Franky090I18n } from "./op17-090-franky.i18n.ts";

export const op17Franky090: CharacterCard = {
  id: "OP17-090",
  canonicalId: "OP17-090",
  slug: "franky/op17-090",
  name: "Franky",
  printings: [
    {
      id: "OP17-090",
      artId: "OP17-090",
      setCode: "OP17",
      collectorNumber: "090",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-090_eKUc87Z.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP17",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Elbaph Straw Hat Crew"],
  attribute: "strike",
  effect:
    "If there is a Character with a cost of 12 or more, this Character gains +3000 power.\n[On Play] If there is a Character with a cost of 12 or more, K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 12,
              },
            ],
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
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 12,
              },
            ],
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
  i18n: op17Franky090I18n,
};
