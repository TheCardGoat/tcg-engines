import type { CharacterCard } from "@tcg/op-types";
import { op07Atlas098I18n } from "./098-atlas.i18n.ts";

export const op07Atlas098: CharacterCard = {
  id: "OP07-098",
  canonicalId: "OP07-098",
  slug: "atlas/op07-098",
  name: "Atlas",
  printings: [
    {
      id: "OP07-098",
      artId: "OP07-098",
      setCode: "OP07",
      collectorNumber: "098",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-098.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  effect:
    "If you have less Life cards than your opponent, this Character cannot be K.O.'d in battle. [Trigger] If your Leader is [Vegapunk], play this card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderName",
            name: "Vegapunk",
          },
        ],
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
  i18n: op07Atlas098I18n,
};
