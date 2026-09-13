import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fullOfBravado } from "./full-of-bravado.ts";

export const fullOfBravadoI18n = defineFamilyI18n(fullOfBravado, {
  en: {
    name: "Full of Bravado",
    text: "When this attacks or defends, if you control an aura of suspense, create a Confidence token.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: fullOfBravadoRedI18n,
  yellow: fullOfBravadoYellowI18n,
  blue: fullOfBravadoBlueI18n,
} = fullOfBravadoI18n.cards;
