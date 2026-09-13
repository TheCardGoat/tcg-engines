import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { earthForm } from "./earth-form.ts";

export const earthFormI18n = defineFamilyI18n(earthForm, {
  en: {
    name: "Earth Form",
    text: "When this hits, create an Embodiment of Earth token.",
    typeText: "Earth Action - Attack",
  },
});

export const {
  red: earthFormRedI18n,
  yellow: earthFormYellowI18n,
  blue: earthFormBlueI18n,
} = earthFormI18n.cards;
