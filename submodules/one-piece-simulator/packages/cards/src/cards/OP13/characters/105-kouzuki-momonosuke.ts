import type { CharacterCard } from "@tcg/op-types";
import { op13KouzukiMomonosuke105I18n } from "./105-kouzuki-momonosuke.i18n.ts";

export const op13KouzukiMomonosuke105: CharacterCard = {
  id: "OP13-105",
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
            action: "rearrangeDeck",
            player: "self",
            count: 99,
            position: "topOrBottom",
          },
        ],
      },
    ],
  },
  i18n: op13KouzukiMomonosuke105I18n,
};
