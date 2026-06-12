import type { CharacterCard } from "@tcg/op-types";
import { op07Bartolomeo031I18n } from "./031-bartolomeo.i18n.ts";

export const op07Bartolomeo031: CharacterCard = {
  id: "OP07-031",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP07",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Supernovas Barto Club"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Your Turn] [Once Per Turn] If a Character is rested by your effect, draw 1 card and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenCharacterRestedByEffect",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07Bartolomeo031I18n,
};
