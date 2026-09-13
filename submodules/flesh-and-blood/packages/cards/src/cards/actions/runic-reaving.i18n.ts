import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { runicReaving } from "./runic-reaving.ts";
const textByColor = {
  red: "Usurp\nInstant - Discard this: Create a Runechant token.",
  yellow: "Usurp\nInstant - Discard this: Create a Runechant token.",
  blue: "Usurp\nInstant - Discard this: Create a Runechant token.",
} as const;
export const runicReavingI18n = defineFamilyI18n(runicReaving, {
  en: {
    name: "Runic Reaving",
    typeText: "Runeblade Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const {
  red: runicReavingRedI18n,
  yellow: runicReavingYellowI18n,
  blue: runicReavingBlueI18n,
} = runicReavingI18n.cards;
