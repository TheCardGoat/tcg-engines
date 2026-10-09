import type { CharacterCard } from "@tcg/op-types";
import { st04Sasaki006I18n } from "./st04-006-sasaki.i18n.ts";

export const st04Sasaki006: CharacterCard = {
  id: "ST04-006",
  canonicalId: "ST04-006",
  slug: "sasaki/st04-006",
  name: "Sasaki",
  printings: [
    {
      id: "ST04-006",
      artId: "ST04-006",
      setCode: "ST04",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-006.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 3,
  traits: ["Animal Kingdom Pirates"],
  power: 4000,
  attribute: "ranged",
  counter: 1000,
  effect:
    "[On Play] DON!! −1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
  i18n: st04Sasaki006I18n,
};
