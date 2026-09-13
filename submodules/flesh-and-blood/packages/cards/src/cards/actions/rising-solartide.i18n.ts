import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { risingSolartide } from "./rising-solartide.ts";

export const risingSolartideI18n = defineFamilyI18n(risingSolartide, {
  en: {
    name: "Rising Solartide",
    typeText: "Light Action - Attack",
    text: "If Rising Solartide hits, put it into your hero's soul.",
  },
});

export const {
  red: risingSolartideRedI18n,
  yellow: risingSolartideYellowI18n,
  blue: risingSolartideBlueI18n,
} = risingSolartideI18n.cards;
