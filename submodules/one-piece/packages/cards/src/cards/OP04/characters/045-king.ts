import type { CharacterCard } from "@tcg/op-types";
import { op04King045I18n } from "./045-king.i18n.ts";

export const op04King045: CharacterCard = {
  id: "OP04-045",
  canonicalId: "OP04-045",
  slug: "king/op04-045",
  name: "King",
  printings: [
    {
      id: "OP04-045",
      artId: "OP04-045",
      setCode: "OP04",
      collectorNumber: "045",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-045.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP04",
  cost: 7,
  power: 8000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "slash",
  effect: "[On Play] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op04King045I18n,
};
