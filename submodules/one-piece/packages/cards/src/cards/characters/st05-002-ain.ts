import type { CharacterCard } from "@tcg/op-types";
import { st05Ain002I18n } from "./st05-002-ain.i18n.ts";

export const st05Ain002: CharacterCard = {
  id: "ST05-002",
  canonicalId: "ST05-002",
  slug: "ain/st05-002",
  name: "Ain",
  printings: [
    {
      id: "ST05-002",
      artId: "ST05-002",
      setCode: "ST05",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-002.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 4,
  power: 5000,
  traits: ["FILM", "Neo Navy"],
  attribute: "special",
  effect: "[On Play] Add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: st05Ain002I18n,
};
