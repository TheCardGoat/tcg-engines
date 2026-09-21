import type { CharacterCard } from "@tcg/op-types";
import { printing } from "../st01-helpers.ts";
import { st01Jinbe005I18n } from "./st01-005-jinbe.i18n.ts";

export const st01Jinbe005: CharacterCard = {
  id: "ST01-005",
  canonicalId: "ST01-005",
  slug: "jinbe/st01-005",
  name: "Jinbe",
  printings: [printing("ST01-005", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 3,
  power: 5000,
  traits: ["Fish-Man", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] Up to 1 of your Leader or Character cards other than this card gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [{ condition: "donAttached", amount: 1 }],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "excludeSelf" }],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: st01Jinbe005I18n,
};
