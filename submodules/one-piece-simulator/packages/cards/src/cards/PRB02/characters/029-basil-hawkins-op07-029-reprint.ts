import type { CharacterCard } from "@tcg/op-types";
import { prb02BasilHawkinsOp07029Reprint029I18n } from "./029-basil-hawkins-op07-029-reprint.i18n.ts";

export const prb02BasilHawkinsOp07029Reprint029: CharacterCard = {
  id: "OP07-029",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "PRB02",
  cost: 6,
  power: 0,
  traits: ["Hawkins Pirates Supernovas"],
  attribute: "slash",
  effect:
    "If your Leader has the [Supernovas] type, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[Once Per Turn] If this Character would be removed from the field by your opponent's effect, you may rest 1 of your opponent's Characters instead.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include \"EN\" at the end of the copyright).",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        replacementAction: {
          action: "rest",
          target: {
            player: "opponent",
            zones: ["character"],
            count: {
              amount: 1,
            },
          },
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02BasilHawkinsOp07029Reprint029I18n,
};
