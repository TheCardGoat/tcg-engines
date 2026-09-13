import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { entwineEarth } from "./entwine-earth.ts";

export const entwineEarthI18n = defineFamilyI18n(entwineEarth, {
  en: {
    name: "Entwine Earth",
    text: "Earth Fusion\nIf Entwine Earth was fused, it gains +2{p}.",
    typeText: "Elemental Action - Attack",
  },
});
export const {
  red: entwineEarthRedI18n,
  yellow: entwineEarthYellowI18n,
  blue: entwineEarthBlueI18n,
} = entwineEarthI18n.cards;
