import type { CharacterCard } from "@tcg/op-types";
import { op04Sasaki048I18n } from "./048-sasaki.i18n.ts";

export const op04Sasaki048: CharacterCard = {
  id: "OP04-048",
  canonicalId: "OP04-048",
  slug: "sasaki/op04-048",
  name: "Sasaki",
  printings: [
    {
      id: "OP04-048",
      artId: "OP04-048",
      setCode: "OP04",
      collectorNumber: "048",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-048.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP04",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[On Play] Return all cards in your hand to your deck and shuffle your deck. Then, draw cards equal to the number you returned to your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 0,
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op04Sasaki048I18n,
};
