import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { frazzle } from "./frazzle.ts";

export const frazzleI18n = defineFamilyI18n(frazzle, {
  en: {
    name: "Frazzle",
    text: ({ textValue1 }) => `Lightning Fusion
If Frazzle was fused, whenever an attack would deal damage this turn, instead it deals that much damage plus ${textValue1}.`,
    typeText: "Elemental Ranger Action - Arrow Attack",
  },
});

export const {
  red: frazzleRedI18n,
  yellow: frazzleYellowI18n,
  blue: frazzleBlueI18n,
} = frazzleI18n.cards;
