import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { meteoricImpact } from "./meteoric-impact.ts";

export const meteoricImpactI18n = defineFamilyI18n(meteoricImpact, {
  en: {
    name: "Meteoric Impact",
    text: (_parameter, color) =>
      `Deal ${color === "red" ? 3 : color === "yellow" ? 2 : 1} arcane damage to any target.\nStarfall - If an instant card has been put into your graveyard this turn, instead deal ${color === "red" ? 5 : color === "yellow" ? 4 : 3} arcane damage.`,
    typeText: "Lightning Wizard Action",
  },
});

export const {
  red: meteoricImpactRedI18n,
  yellow: meteoricImpactYellowI18n,
  blue: meteoricImpactBlueI18n,
} = meteoricImpactI18n.cards;
