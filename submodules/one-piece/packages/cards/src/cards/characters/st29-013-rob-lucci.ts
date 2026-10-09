import type { CharacterCard } from "@tcg/op-types";
import { st29RobLucci013I18n } from "./st29-013-rob-lucci.i18n.ts";
export const st29RobLucci013: CharacterCard = {
  id: "ST29-013",
  canonicalId: "ST29-013",
  slug: "rob-lucci/st29-013",
  name: "Rob Lucci",
  printings: [
    {
      id: "ST29-013",
      artId: "ST29-013",
      setCode: "ST29",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-013.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Egghead", "CP0"],
  attribute: "strike",
  effect: "-",
  trigger:
    "K.O. up to 1 of your opponent's Characters with a cost equal to or less than the total of your and your opponent's Life cards.",
  effects: {
    effects: [
      {
        trigger: "trigger",
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
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "totalLifeCount",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st29RobLucci013I18n,
};
