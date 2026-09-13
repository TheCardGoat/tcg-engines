import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flattenTheField } from "./flatten-the-field.ts";

export const flattenTheFieldI18n = defineFamilyI18n(flattenTheField, {
  en: {
    name: "Flatten the Field",
    text: "Crush - When this deals 4 or more damage to a hero, destroy a Seismic Surge token they control.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: flattenTheFieldRedI18n,
  yellow: flattenTheFieldYellowI18n,
  blue: flattenTheFieldBlueI18n,
} = flattenTheFieldI18n.cards;
