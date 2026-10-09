import type { CharacterCard } from "@tcg/op-types";
import { pMsAllSunday144I18n } from "./p-144-ms-all-sunday.i18n.ts";
export const pMsAllSunday144: CharacterCard = {
  id: "P-144",
  canonicalId: "P-144",
  slug: "ms-all-sunday/p-144",
  name: "Ms. All Sunday",
  printings: [
    {
      id: "P-144",
      artId: "P-144",
      setCode: "P",
      collectorNumber: "144",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-144.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 5,
  traits: ["Baroque Works"],
  power: 6000,
  attribute: "strike",
  counter: 1000,
  effect:
    '[On Play] You may K.O. 1 of your Characters with a type including "Baroque Works": Draw 1 card.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "koCharacter",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Baroque Works",
                match: "includes",
              },
            ],
          },
        ],
        optional: true,
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
  i18n: pMsAllSunday144I18n,
};
