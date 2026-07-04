import type { CharacterCard } from "@tcg/op-types";
import { op04KouzukiHiyori103I18n } from "./103-kouzuki-hiyori.i18n.ts";

export const op04KouzukiHiyori103: CharacterCard = {
  id: "OP04-103",
  canonicalId: "OP04-103",
  slug: "kouzuki-hiyori/op04-103",
  name: "Kouzuki Hiyori",
  printings: [
    {
      id: "OP04-103",
      artId: "OP04-103",
      setCode: "OP04",
      collectorNumber: "103",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-103.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP04",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  effect:
    "[On Play] Up to 1 of your [Land of Wano] type Leader or Character cards gains +1000 power during this turn. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
          },
        ],
      },
    ],
  },
  i18n: op04KouzukiHiyori103I18n,
};
