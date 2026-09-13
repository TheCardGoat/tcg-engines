import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rapidReflex } from "./rapid-reflex.ts";

export const rapidReflexI18n = defineFamilyI18n(rapidReflex, {
  en: {
    name: "Rapid Reflex",
    typeText: "Ninja Attack Reaction",
    text: (amount) => `Target attack action card with cost 0 gains +${amount}{p}.`,
  },
});
export const {
  red: rapidReflexRedI18n,
  yellow: rapidReflexYellowI18n,
  blue: rapidReflexBlueI18n,
} = rapidReflexI18n.cards;
