import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { echoingTrap } from "./echoing-trap.ts";
const textByColor = {
  blue: "Ambush\nWhen this defends an attack action card with the same name as another card played this turn, the attacking hero discards a card.",
} as const;
export const echoingTrapI18n = defineFamilyI18n(echoingTrap, {
  en: {
    name: "Echoing Trap",
    typeText: "Ranger Block - Trap",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { blue: echoingTrapBlueI18n } = echoingTrapI18n.cards;
