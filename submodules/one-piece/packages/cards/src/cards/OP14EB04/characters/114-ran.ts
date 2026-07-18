import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Ran114I18n } from "./114-ran.i18n.ts";

export const op14eb04Ran114: CharacterCard = {
  id: "OP14-114",
  canonicalId: "OP14-114",
  slug: "ran/op14-114",
  name: "Ran",
  printings: [
    {
      id: "OP14-114",
      artId: "OP14-114",
      setCode: "OP14EB04",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-114_Q6Lwc1w.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "If your Leader has the {Kuja Pirates} type, play this card.",
  traits: ["Kuja Pirates"],
  attribute: "ranged",
  effect:
    "[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to 1 of your {Kuja Pirates} type Leader or Character cards.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Kuja Pirates",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Kuja Pirates",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
            self: true,
          },
        ],
      },
    ],
  },
  i18n: op14eb04Ran114I18n,
};
