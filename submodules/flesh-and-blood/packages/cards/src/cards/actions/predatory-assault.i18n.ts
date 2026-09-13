import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { predatoryAssault } from "./predatory-assault.ts";

export const predatoryAssaultI18n = defineFamilyI18n(predatoryAssault, {
  en: {
    name: "Predatory Assault",
    text: "If you have discarded a card with 6 or more {p} this turn, Predatory Assault gains dominate.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: predatoryAssaultRedI18n,
  yellow: predatoryAssaultYellowI18n,
  blue: predatoryAssaultBlueI18n,
} = predatoryAssaultI18n.cards;
