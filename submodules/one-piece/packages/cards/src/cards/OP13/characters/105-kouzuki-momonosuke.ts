import type { CharacterCard } from "@tcg/op-types";
import { op13KouzukiMomonosuke105I18n } from "./105-kouzuki-momonosuke.i18n.ts";

export const op13KouzukiMomonosuke105: CharacterCard = {
  id: "OP13-105",
  canonicalId: "OP13-105",
  slug: "kouzuki-momonosuke/op13-105",
  name: "Kouzuki Momonosuke",
  printings: [
    {
      id: "OP13-105",
      artId: "OP13-105",
      setCode: "OP13",
      collectorNumber: "105",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-105_QxnP6lI.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP13",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "slash",
  effect:
    "[On Play] Look at all of your Life cards and place them back in your Life area in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeLife",
            player: "self",
          },
        ],
      },
    ],
  },
  i18n: op13KouzukiMomonosuke105I18n,
};
