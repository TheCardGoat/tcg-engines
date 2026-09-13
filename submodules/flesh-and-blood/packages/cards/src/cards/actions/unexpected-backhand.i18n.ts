import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { unexpectedBackhand } from "./unexpected-backhand.ts";

export const unexpectedBackhandI18n = defineFamilyI18n(unexpectedBackhand, {
  en: {
    name: "Unexpected Backhand",
    text: "When you win a clash revealing this, deal 1 damage to the other hero.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: unexpectedBackhandRedI18n,
  yellow: unexpectedBackhandYellowI18n,
  blue: unexpectedBackhandBlueI18n,
} = unexpectedBackhandI18n.cards;
