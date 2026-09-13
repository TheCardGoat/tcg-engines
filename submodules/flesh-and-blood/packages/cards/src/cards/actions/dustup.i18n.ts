import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dustup } from "./dustup.ts";

export const dustupI18n = defineFamilyI18n(dustup, {
  en: {
    name: "Dustup",
    typeText: "Draconic Illusionist Action - Attack",
    text: "When Dustup hits, create an Ash token, then transform up to 1 ash you control into an Aether Ashwing.",
  },
});

export const {
  red: dustupRedI18n,
  yellow: dustupYellowI18n,
  blue: dustupBlueI18n,
} = dustupI18n.cards;
