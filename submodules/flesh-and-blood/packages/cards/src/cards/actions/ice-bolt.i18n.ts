import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { iceBolt } from "./ice-bolt.ts";

export const iceBoltI18n = defineFamilyI18n(iceBolt, {
  en: {
    name: "Ice Bolt",
    text: ({ damage }) => `Deal ${damage} arcane damage to any target.`,
    typeText: "Ice Wizard Action",
  },
});

export const {
  red: iceBoltRedI18n,
  yellow: iceBoltYellowI18n,
  blue: iceBoltBlueI18n,
} = iceBoltI18n.cards;
