import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { runicDisposition } from "./runic-disposition.ts";
const textByColor = {
  red: "Usurp\nInstant - Discard this: Create a Runechant token.",
  yellow: "Usurp\nInstant - Discard this: Create a Runechant token.",
  blue: "Usurp\nInstant - Discard this: Create a Runechant token.",
} as const;
export const runicDispositionI18n = defineFamilyI18n(runicDisposition, {
  en: {
    name: "Runic Disposition",
    typeText: "Runeblade Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const {
  red: runicDispositionRedI18n,
  yellow: runicDispositionYellowI18n,
  blue: runicDispositionBlueI18n,
} = runicDispositionI18n.cards;
