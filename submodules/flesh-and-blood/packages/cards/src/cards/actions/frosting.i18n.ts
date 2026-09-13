import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { frosting } from "./frosting.ts";

export const frostingI18n = defineFamilyI18n(frosting, {
  en: {
    name: "Frosting",
    text: ({ damage }) => `Deal ${damage} arcane damage to any target.`,
    typeText: "Ice Wizard Action",
  },
});

export const {
  red: frostingRedI18n,
  yellow: frostingYellowI18n,
  blue: frostingBlueI18n,
} = frostingI18n.cards;
