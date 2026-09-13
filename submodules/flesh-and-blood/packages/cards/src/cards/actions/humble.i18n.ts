import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { humble } from "./humble.ts";

export const humbleI18n = defineFamilyI18n(humble, {
  en: {
    name: "Humble",
    typeText: "Generic Action - Attack",
    text: "When this hits a hero, they lose all hero card abilities until the end of their next turn.",
  },
});

export const {
  red: humbleRedI18n,
  yellow: humbleYellowI18n,
  blue: humbleBlueI18n,
} = humbleI18n.cards;
