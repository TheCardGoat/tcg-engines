import type { CharacterCard } from "@tcg/op-types";
import { op05DonquixoteRosinante030I18n } from "./030-donquixote-rosinante.i18n.ts";

export const op05DonquixoteRosinante030: CharacterCard = {
  id: "OP05-030",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP05",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Opponent's Turn] If your rested Character would be K.O.'d, you may trash this Character instead.",
  effects: {
    keywords: ["blocker"],
    replacementEffects: [
      {
        replacedEvent: "ko",
        replacementAction: {
          action: "trashThisCard",
        },
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
      },
    ],
  },
  i18n: op05DonquixoteRosinante030I18n,
};
