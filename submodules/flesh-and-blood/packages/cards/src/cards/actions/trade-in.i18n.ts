import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tradeIn } from "./trade-in.ts";

export const tradeInI18n = defineFamilyI18n(tradeIn, {
  en: {
    name: "Trade In",
    text: "When this attacks, you may discard a card. If you do, draw a card.\nIf this was played from arsenal, it gains go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: tradeInRedI18n,
  yellow: tradeInYellowI18n,
  blue: tradeInBlueI18n,
} = tradeInI18n.cards;
