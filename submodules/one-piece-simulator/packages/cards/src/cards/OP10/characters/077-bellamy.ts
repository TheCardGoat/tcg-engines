import type { CharacterCard } from "@tcg/op-types";
import { op10Bellamy077I18n } from "./077-bellamy.i18n.ts";

export const op10Bellamy077: CharacterCard = {
  id: "OP10-077",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP10",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Block] You may rest 2 of your DON!! cards: Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onBlock",
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
  i18n: op10Bellamy077I18n,
};
