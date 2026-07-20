import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Koala046I18n } from "./046-koala.i18n.ts";

export const op14eb04Koala046: CharacterCard = {
  id: "OP14-046",
  canonicalId: "OP14-046",
  slug: "koala/op14-046",
  name: "Koala",
  printings: [
    {
      id: "OP14-046",
      artId: "OP14-046",
      setCode: "OP14EB04",
      collectorNumber: "046",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-046_tPRD8Rh.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Foolshout Island"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may trash this Character: Up to 1 of your {Fish-Man} or {Merfolk} type Leader or Character cards gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
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
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04Koala046I18n,
};
