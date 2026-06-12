import type { CharacterCard } from "@tcg/op-types";
import { op13Vista046I18n } from "./046-vista.i18n.ts";

export const op13Vista046: CharacterCard = {
  id: "OP13-046",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP13",
  cost: 6,
  power: 8000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Double Attack]\n[Once Per Turn] If this Character would be K.O.'d or would be removed from the field by your opponent's effect, you may trash 1 card with a type including \"Whitebeard Pirates\" from your hand instead.",
  effects: {
    keywords: ["doubleAttack"],
    replacementEffects: [
      {
        replacedEvent: "ko",
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
          filters: [
            {
              filter: "trait",
              value: "Whitebeard Pirates",
            },
          ],
        },
        oncePerTurn: true,
      },
      {
        replacedEvent: "removeFromField",
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
          filters: [
            {
              filter: "trait",
              value: "Whitebeard Pirates",
            },
          ],
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op13Vista046I18n,
};
