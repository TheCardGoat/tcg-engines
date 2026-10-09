import type { CharacterCard } from "@tcg/op-types";
import { st10Bepo012I18n } from "./st10-012-bepo.i18n.ts";
export const st10Bepo012: CharacterCard = {
  id: "ST10-012",
  canonicalId: "ST10-012",
  slug: "bepo/st10-012",
  name: "Bepo",
  printings: [
    {
      id: "ST10-012",
      artId: "ST10-012",
      setCode: "ST10",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-012.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Minks", "Heart Pirates"],
  attribute: "strike",
  effect:
    "[On Play]/[When Attacking] If your opponent has more DON!! cards on their field than you, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lt",
          },
        ],
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
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lt",
          },
        ],
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
  i18n: st10Bepo012I18n,
};
