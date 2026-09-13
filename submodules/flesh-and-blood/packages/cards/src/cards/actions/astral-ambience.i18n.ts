import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { astralAmbience } from "./astral-ambience.ts";
const textByColor = {
  yellow:
    "Whenever this fragments, create a Spectral Shield token.\nInstant - {t} a Spectral Shield you control: This gets go again.\nFragment",
} as const;
export const astralAmbienceI18n = defineFamilyI18n(astralAmbience, {
  en: {
    name: "Astral Ambience",
    typeText: "Illusionist Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { yellow: astralAmbienceYellowI18n } = astralAmbienceI18n.cards;
