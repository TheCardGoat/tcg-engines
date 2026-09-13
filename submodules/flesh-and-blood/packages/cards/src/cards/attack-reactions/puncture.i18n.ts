import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { puncture } from "./puncture.ts";

export const punctureI18n = defineFamilyI18n(puncture, {
  en: {
    name: "Puncture",
    typeText: "Warrior Attack Reaction",
    text: (amount) => `Target sword or dagger attack gains +${amount}{p} and piercing 1.`,
  },
});
export const {
  red: punctureRedI18n,
  yellow: punctureYellowI18n,
  blue: punctureBlueI18n,
} = punctureI18n.cards;
