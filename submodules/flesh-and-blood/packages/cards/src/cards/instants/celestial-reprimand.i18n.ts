import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { celestialReprimand } from "./celestial-reprimand.ts";

export const celestialReprimandI18n = defineFamilyI18n(celestialReprimand, {
  en: {
    name: "Celestial Reprimand",
    typeText: "Light Illusionist Instant",
    text: (amount) =>
      `Target card defending an attack with Herald in its name gets -${amount}{p} this combat chain.`,
  },
});

export const {
  red: celestialReprimandRedI18n,
  yellow: celestialReprimandYellowI18n,
  blue: celestialReprimandBlueI18n,
} = celestialReprimandI18n.cards;
