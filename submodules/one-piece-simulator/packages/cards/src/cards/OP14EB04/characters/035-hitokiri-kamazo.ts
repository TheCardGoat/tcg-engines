import type { CharacterCard } from "@tcg/op-types";
import { op14eb04HitokiriKamazo035I18n } from "./035-hitokiri-kamazo.i18n.ts";

export const op14eb04HitokiriKamazo035: CharacterCard = {
  id: "EB04-035",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Kid Pirates Supernovas SMILE"],
  attribute: "slash",
  effect:
    "[Blocker]\n[Your Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, if your Leader has the {Kid Pirates} type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "your",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04HitokiriKamazo035I18n,
};
