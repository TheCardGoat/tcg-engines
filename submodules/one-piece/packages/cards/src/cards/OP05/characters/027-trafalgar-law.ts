import type { CharacterCard } from "@tcg/op-types";
import { op05TrafalgarLaw027I18n } from "./027-trafalgar-law.i18n.ts";

export const op05TrafalgarLaw027: CharacterCard = {
  id: "OP05-027",
  canonicalId: "OP05-027",
  slug: "trafalgar-law/op05-027",
  name: "Trafalgar Law",
  printings: [
    {
      id: "OP05-027",
      artId: "OP05-027",
      setCode: "OP05",
      collectorNumber: "027",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-027.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP05",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may trash this Character: Rest up to 1 of your opponent's Characters with a cost of 3 or less.",
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
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05TrafalgarLaw027I18n,
};
