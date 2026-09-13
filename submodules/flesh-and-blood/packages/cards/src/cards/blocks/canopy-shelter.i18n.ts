import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { canopyShelter } from "./canopy-shelter.ts";

export const canopyShelterI18n = defineFamilyI18n(canopyShelter, {
  en: {
    name: "Canopy Shelter",
    text: "When this defends, create a Might token.",
    typeText: "Earth Block",
  },
});

export const { blue: canopyShelterBlueI18n } = canopyShelterI18n.cards;
