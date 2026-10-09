import type { CharacterCard } from "@tcg/op-types";
import { st26NicoRobin003I18n } from "./st26-003-nico-robin.i18n.ts";
export const st26NicoRobin003: CharacterCard = {
  id: "ST26-003",
  canonicalId: "ST26-003",
  slug: "nico-robin/st26-003",
  name: "Nico Robin",
  printings: [
    {
      id: "ST26-003",
      artId: "ST26-003",
      setCode: "ST26",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST26-003.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "ST26",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] DON!! −2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st26NicoRobin003I18n,
};
