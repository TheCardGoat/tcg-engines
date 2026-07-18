import type { CharacterCard } from "@tcg/op-types";
import { op01KurozumiSemimaru099I18n } from "./099-kurozumi-semimaru.i18n.ts";

export const op01KurozumiSemimaru099: CharacterCard = {
  id: "OP01-099",
  canonicalId: "OP01-099",
  slug: "kurozumi-semimaru",
  name: "Kurozumi Semimaru",
  printings: [
    {
      id: "OP01-099",
      artId: "OP01-099",
      setCode: "OP01",
      collectorNumber: "099",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-099.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Land of Wano Kurozumi Clan"],
  attribute: "special",
  effect:
    "Kurozumi Clan type Characters other than your [Kurozumi Semimaru] cannot be K.O.'d in battle.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Kurozumi Clan",
                  match: "includes",
                },
                {
                  filter: "excludeName",
                  value: "Kurozumi Semimaru",
                },
              ],
            },
            duration: "permanent",
            restriction: "inBattle",
          },
        ],
      },
    ],
  },
  i18n: op01KurozumiSemimaru099I18n,
};
