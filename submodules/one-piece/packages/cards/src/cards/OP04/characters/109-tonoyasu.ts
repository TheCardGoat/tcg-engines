import type { CharacterCard } from "@tcg/op-types";
import { op04Tonoyasu109I18n } from "./109-tonoyasu.i18n.ts";

export const op04Tonoyasu109: CharacterCard = {
  id: "OP04-109",
  canonicalId: "OP04-109",
  slug: "tonoyasu",
  name: "Tonoyasu",
  printings: [
    {
      id: "OP04-109",
      artId: "OP04-109",
      setCode: "OP04",
      collectorNumber: "109",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-109.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may trash this Character: Up to 1 of your [Land of Wano] type Leader or Character cards gains +3000 power during this turn.",
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
                  filter: "trait",
                  value: "Land of Wano",
                  match: "includes",
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Tonoyasu109I18n,
};
