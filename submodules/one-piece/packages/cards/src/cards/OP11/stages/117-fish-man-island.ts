import type { StageCard } from "@tcg/op-types";
import { op11FishManIsland117I18n } from "./117-fish-man-island.i18n.ts";

export const op11FishManIsland117: StageCard = {
  id: "OP11-117",
  canonicalId: "OP11-117",
  slug: "fish-man-island",
  name: "Fish-Man Island",
  printings: [
    {
      id: "OP11-117",
      artId: "OP11-117",
      setCode: "OP11",
      collectorNumber: "117",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-117.jpg",
    },
  ],
  cardType: "stage",
  color: ["yellow"],
  rarity: "C",
  setId: "OP11",
  cost: 2,
  traits: ["Fish-Man Island"],
  effect:
    '[Activate: Main] [Once Per Turn] If your Leader is [Shirahoshi], you may turn 1 card from the top of your Life cards face-up: Up to 1 of your "Neptunian", "Fish-Man", or "Merfolk" type Characters gains +1000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderName",
            name: "Shirahoshi",
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
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Neptunian",
                },
                {
                  filter: "trait",
                  value: "Fish-Man",
                },
                {
                  filter: "trait",
                  value: "Merfolk",
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11FishManIsland117I18n,
};
