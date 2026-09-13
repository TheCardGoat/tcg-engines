import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { aetherDart } from "./aether-dart.ts";

export const aetherDartI18n = defineFamilyI18n(aetherDart, {
  en: {
    name: "Aether Dart",
    text: ({ damage }) => `Deal ${damage} arcane damage to any target.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: aetherDartRedI18n,
  yellow: aetherDartYellowI18n,
  blue: aetherDartBlueI18n,
} = aetherDartI18n.cards;
