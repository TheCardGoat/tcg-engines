import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { aetherHail } from "./aether-hail.ts";

export const aetherHailI18n = defineFamilyI18n(aetherHail, {
  en: {
    name: "Aether Hail",
    text: ({ damage }) => `Deal ${damage} arcane damage to any target.`,
    typeText: "Ice Wizard Action",
  },
});

export const {
  red: aetherHailRedI18n,
  yellow: aetherHailYellowI18n,
  blue: aetherHailBlueI18n,
} = aetherHailI18n.cards;
