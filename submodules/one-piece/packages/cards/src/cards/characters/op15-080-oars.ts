import type { CharacterCard } from "@tcg/op-types";
import { op15Oars080I18n } from "./op15-080-oars.i18n.ts";

export const op15Oars080: CharacterCard = {
  id: "OP15-080",
  canonicalId: "OP15-080",
  slug: "oars/op15-080",
  name: "Oars",
  printings: [
    {
      id: "OP15-080",
      artId: "OP15-080",
      setCode: "OP15",
      collectorNumber: "080",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-080_nscc2yr.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP15",
  cost: 4,
  power: 0,
  counter: 1000,
  traits: ["Giant Thriller Bark Pirates"],
  attribute: "strike",
  effect:
    "If you have [Gecko Moria] with 10000 power or more on your field and there are no other [Oars] cards, this Character gains +7000 power.\n[On K.O.] You may place 3 cards from your trash at the bottom of your deck in any order: Play this Character card from your trash.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        costs: [
          {
            cost: "returnTrashToDeck",
            amount: 3,
            position: "bottom",
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
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "name",
                value: "Gecko Moria",
              },
              {
                filter: "power",
                comparison: "gte",
                value: 10000,
              },
            ],
          },
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "eq",
            value: 0,
            filters: [
              {
                filter: "name",
                value: "Oars",
              },
              {
                filter: "excludeSelf",
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
            value: 7000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op15Oars080I18n,
};
