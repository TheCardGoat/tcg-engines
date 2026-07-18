import type { CharacterCard } from "@tcg/op-types";
import { op10Foxy075I18n } from "./075-foxy.i18n.ts";

export const op10Foxy075: CharacterCard = {
  id: "OP10-075",
  canonicalId: "OP10-075",
  slug: "foxy/op10-075",
  name: "Foxy",
  printings: [
    {
      id: "OP10-075",
      artId: "OP10-075",
      setCode: "OP10",
      collectorNumber: "075",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-075.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  power: 1000,
  counter: 2000,
  traits: ["Foxy Pirates"],
  attribute: "special",
  effect:
    "[Activate: Main] You may trash this Character: If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, draw 1 card.",
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
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "donFieldComparison",
              selfComparison: "lte",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Foxy075I18n,
};
