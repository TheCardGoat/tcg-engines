import type { CharacterCard } from "@tcg/op-types";
import { op06ZephyrNavy074I18n } from "./074-zephyr-navy.i18n.ts";

export const op06ZephyrNavy074: CharacterCard = {
  id: "OP06-074",
  canonicalId: "OP06-074",
  slug: "zephyr-navy/op06-074",
  name: "Zephyr (Navy)",
  printings: [
    {
      id: "OP06-074",
      artId: "OP06-074",
      setCode: "OP06",
      collectorNumber: "074",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-074.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP06",
  cost: 7,
  power: 7000,
  traits: ["FILM Navy"],
  attribute: "strike",
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Negate the effect of up to 1 of your opponent's Characters during this turn. Then, if that Character has 5000 power or less, K.O. it.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op06ZephyrNavy074I18n,
};
