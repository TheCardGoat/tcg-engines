import type { CharacterCard } from "@tcg/op-types";
import { eb03Shirahoshi052I18n } from "./052-shirahoshi.i18n.ts";

export const eb03Shirahoshi052: CharacterCard = {
  id: "EB03-052",
  canonicalId: "EB03-052",
  slug: "shirahoshi/eb03-052",
  name: "Shirahoshi",
  printings: [
    {
      id: "EB03-052",
      artId: "EB03-052",
      setCode: "EB03",
      collectorNumber: "052",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-052_XY4834Z.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB03",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may trash this Character: If your Leader is [Shirahoshi], add 1 card from the top of your deck to the top of your Life cards. Then, all of your {Neptunian} type Characters gain +1000 power during this turn.",
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
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
              },
            },
            position: "top",
            condition: {
              condition: "leaderName",
              name: "Shirahoshi",
            },
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Neptunian",
                  match: "includes",
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03Shirahoshi052I18n,
};
