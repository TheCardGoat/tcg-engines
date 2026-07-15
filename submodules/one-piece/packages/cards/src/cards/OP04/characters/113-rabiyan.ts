import type { CharacterCard } from "@tcg/op-types";
import { op04Rabiyan113I18n } from "./113-rabiyan.i18n.ts";

export const op04Rabiyan113: CharacterCard = {
  id: "OP04-113",
  canonicalId: "OP04-113",
  slug: "rabiyan",
  name: "Rabiyan",
  printings: [
    {
      id: "OP04-113",
      artId: "OP04-113",
      setCode: "OP04",
      collectorNumber: "113",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-113.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Big Mom Pirates Homies"],
  attribute: "special",
  effect: "[Trigger] Play this card.",
  effects: {
    effects: [
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
  i18n: op04Rabiyan113I18n,
};
