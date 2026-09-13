import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { crossTheLine } from "./cross-the-line.ts";

export const crossTheLineI18n = defineFamilyI18n(crossTheLine, {
  en: {
    name: "Cross the Line",
    typeText: "Light Warrior Action - Attack",
    text: "As an additional cost to play Cross the Line, you may charge your hero's soul.",
  },
});

export const {
  red: crossTheLineRedI18n,
  yellow: crossTheLineYellowI18n,
  blue: crossTheLineBlueI18n,
} = crossTheLineI18n.cards;
