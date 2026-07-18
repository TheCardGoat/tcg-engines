import type { CharacterCard } from "@tcg/op-types";
import { op11Neptune108I18n } from "./108-neptune.i18n.ts";

export const op11Neptune108: CharacterCard = {
  id: "OP11-108",
  canonicalId: "OP11-108",
  slug: "neptune",
  name: "Neptune",
  printings: [
    {
      id: "OP11-108",
      artId: "OP11-108",
      setCode: "OP11",
      collectorNumber: "108",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-108.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP11",
  cost: 5,
  power: 7000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader is [Shirahoshi], you may turn 1 card from the top of your Life cards face-down: Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
            faceUp: false,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
        conditions: [
          {
            condition: "leaderName",
            name: "Shirahoshi",
          },
        ],
      },
    ],
  },
  i18n: op11Neptune108I18n,
};
