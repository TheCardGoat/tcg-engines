import type { CharacterCard } from "@tcg/op-types";
import { st10JeanBart009I18n } from "./st10-009-jean-bart.i18n.ts";
export const st10JeanBart009: CharacterCard = {
  id: "ST10-009",
  canonicalId: "ST10-009",
  slug: "jean-bart/st10-009",
  name: "Jean Bart",
  printings: [
    {
      id: "ST10-009",
      artId: "ST10-009",
      setCode: "ST10",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-009.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Heart Pirates"],
  attribute: "strike",
  effect:
    "[On Play] \u2780 (You may rest the specified number of DON!! cards in your cost area.): Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "restDon",
            amount: 1,
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
      },
    ],
  },
  i18n: st10JeanBart009I18n,
};
