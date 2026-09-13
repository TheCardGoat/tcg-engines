import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sigilOfTheMuse } from "./sigil-of-the-muse.ts";
const textByColor = {
  red: "If a hero would draw 1 or more cards during an action phase, instead they create that many Ponder tokens.\nAt the beginning of your action phase, destroy this and create a Ponder token.",
} as const;
export const sigilOfTheMuseI18n = defineFamilyI18n(sigilOfTheMuse, {
  en: {
    name: "Sigil of the Muse",
    typeText: "Wizard Action - Aura",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { red: sigilOfTheMuseRedI18n } = sigilOfTheMuseI18n.cards;
