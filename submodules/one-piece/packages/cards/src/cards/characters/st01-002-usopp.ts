import type { CharacterCard } from "@tcg/op-types";
import { printing, strawHat } from "../st01-helpers.ts";
import { st01Usopp002I18n } from "./st01-002-usopp.i18n.ts";

export const st01Usopp002: CharacterCard = {
  id: "ST01-002",
  canonicalId: "ST01-002",
  slug: "usopp/st01-002",
  name: "Usopp",
  printings: [printing("ST01-002", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: strawHat,
  attribute: "ranged",
  trigger: "Play this card.",
  effect:
    "[DON!! x2] [When Attacking] Your opponent cannot activate a [Blocker] Character that has 5000 or more power during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [{ condition: "donAttached", amount: 2 }],
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: "all" },
              filters: [{ filter: "power", comparison: "gte", value: 5000 }],
            },
            keyword: "blocker",
            requiresKeyword: true,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "playThisCard" }],
      },
    ],
  },
  i18n: st01Usopp002I18n,
};
