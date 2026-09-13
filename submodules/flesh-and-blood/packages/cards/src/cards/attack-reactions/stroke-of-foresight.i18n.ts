import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { strokeOfForesight } from "./stroke-of-foresight.ts";

export const strokeOfForesightI18n = defineFamilyI18n(strokeOfForesight, {
  en: {
    name: "Stroke of Foresight",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target weapon attack gains +${amount}{p}. If the defending hero has defended with a card from their hand this chain link, draw a card, then put a card from your hand on the top or bottom of your deck.`,
  },
});
export const {
  red: strokeOfForesightRedI18n,
  yellow: strokeOfForesightYellowI18n,
  blue: strokeOfForesightBlueI18n,
} = strokeOfForesightI18n.cards;
