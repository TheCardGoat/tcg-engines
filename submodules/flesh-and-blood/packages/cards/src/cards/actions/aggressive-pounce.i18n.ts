import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { aggressivePounce } from "./aggressive-pounce.ts";

export const aggressivePounceI18n = defineFamilyI18n(aggressivePounce, {
  en: {
    name: "Aggressive Pounce",
    text: "If you've intimidated an opponent this turn, this gets go again.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: aggressivePounceRedI18n,
  yellow: aggressivePounceYellowI18n,
  blue: aggressivePounceBlueI18n,
} = aggressivePounceI18n.cards;
