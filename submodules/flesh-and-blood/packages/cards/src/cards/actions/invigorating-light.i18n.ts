import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { invigoratingLight } from "./invigorating-light.ts";

export const invigoratingLightI18n = defineFamilyI18n(invigoratingLight, {
  en: {
    name: "Invigorating Light",
    typeText: "Light Action - Attack",
    text: "When you play Invigorating Light, if there are no cards in your hero's soul, put it into your hero's soul when the combat chain closes.",
  },
});

export const {
  red: invigoratingLightRedI18n,
  yellow: invigoratingLightYellowI18n,
  blue: invigoratingLightBlueI18n,
} = invigoratingLightI18n.cards;
