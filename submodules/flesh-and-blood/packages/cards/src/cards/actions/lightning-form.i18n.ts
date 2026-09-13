import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lightningForm } from "./lightning-form.ts";

export const lightningFormI18n = defineFamilyI18n(lightningForm, {
  en: {
    name: "Lightning Form",
    typeText: "Lightning Action - Attack",
    text: "When this hits, create an Embodiment of Lightning token.",
  },
});

export const {
  red: lightningFormRedI18n,
  yellow: lightningFormYellowI18n,
  blue: lightningFormBlueI18n,
} = lightningFormI18n.cards;
