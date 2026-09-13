import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blanch } from "./blanch.ts";

export const blanchI18n = defineFamilyI18n(blanch, {
  en: {
    name: "Blanch",
    typeText: "Generic Action - Attack",
    text: "When this hits a hero, cards they own lose all colors until the end of their next turn.",
  },
});

export const {
  red: blanchRedI18n,
  yellow: blanchYellowI18n,
  blue: blanchBlueI18n,
} = blanchI18n.cards;
