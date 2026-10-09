import type { CharacterCard } from "@tcg/op-types";
import { st28Kinemon003I18n } from "./st28-003-kin-emon.i18n.ts";
export const st28Kinemon003: CharacterCard = {
  id: "ST28-003",
  canonicalId: "ST28-003",
  slug: "kin-emon/st28-003",
  name: "Kin'emon",
  printings: [
    {
      id: "ST28-003",
      artId: "ST28-003",
      setCode: "ST28",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST28-003.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST28",
  cost: 4,
  traits: ["Land of Wano", "The Akazaya Nine"],
  power: 5000,
  attribute: "slash",
  counter: 2000,
  effect: "-",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Land of Wano",
                match: "exact",
              },
              {
                condition: "lifeCount",
                player: "opponent",
                comparison: "lte",
                value: 3,
              },
            ],
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  trigger:
    "[Trigger] If your Leader has the {Land of Wano} type and your opponent has 3 or less Life cards, play this card.",
  i18n: st28Kinemon003I18n,
};
