import type { CharacterCard } from "@tcg/op-types";
import { op05ElizabelloIi080I18n } from "./080-elizabello-ii.i18n.ts";

export const op05ElizabelloIi080: CharacterCard = {
  id: "OP05-080",
  canonicalId: "OP05-080",
  slug: "elizabello-ii",
  name: "Elizabello II",
  printings: [
    {
      id: "OP05-080",
      artId: "OP05-080",
      setCode: "OP05",
      collectorNumber: "080",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-080.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Dressrosa Kingdom of Prodence"],
  attribute: "strike",
  effect:
    "[When Attacking][Once Per Turn] You may return 20 cards from your trash to your deck and shuffle it: This Character gains and +10000 power during this battle. (This card deals 2 damage.)",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
            value: 10000,
            duration: "thisBattle",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05ElizabelloIi080I18n,
};
