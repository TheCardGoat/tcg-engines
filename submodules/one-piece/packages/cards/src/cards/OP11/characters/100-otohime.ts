import type { CharacterCard } from "@tcg/op-types";
import { op11Otohime100I18n } from "./100-otohime.i18n.ts";

export const op11Otohime100: CharacterCard = {
  id: "OP11-100",
  canonicalId: "OP11-100",
  slug: "otohime",
  name: "Otohime",
  printings: [
    {
      id: "OP11-100",
      artId: "OP11-100",
      setCode: "OP11",
      collectorNumber: "100",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-100.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP11",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "wisdom",
  effect:
    "[On Play] If your Leader is [Shirahoshi], you may turn 1 card from the top of your Life cards face-down: Draw 1 card.",
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
  i18n: op11Otohime100I18n,
};
