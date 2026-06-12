import type { CharacterCard } from "@tcg/op-types";
import { eb03ONamiSt18002002I18n } from "./002-o-nami-st18-002.i18n.ts";

export const eb03ONamiSt18002002: CharacterCard = {
  id: "ST18-002",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB03",
  cost: 4,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n\n[On Play] If you have 8 or more DON!! cards on your field, trash 1 card from your hand and draw 2 cards.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: eb03ONamiSt18002002I18n,
};
