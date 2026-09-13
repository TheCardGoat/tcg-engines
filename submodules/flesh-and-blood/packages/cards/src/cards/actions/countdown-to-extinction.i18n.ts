import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { countdownToExtinction } from "./countdown-to-extinction.ts";
const textByColor = {
  red: "When this attacks, create a Gate to i'Arathael token.\nWhen this hits, you may search your deck for a Darkest Hour, banish it, then shuffle.\nBlood Debt",
  yellow:
    "When this attacks, create a Gate to i'Arathael token.\nWhen this hits, you may search your deck for a Darkest Hour, banish it, then shuffle.\nBlood Debt",
  blue: "When this attacks, create a Gate to i'Arathael token.\nWhen this hits, you may search your deck for a Darkest Hour, banish it, then shuffle.\nBlood Debt",
} as const;
export const countdownToExtinctionI18n = defineFamilyI18n(countdownToExtinction, {
  en: {
    name: "Countdown to Extinction",
    typeText: "Shadow Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const {
  red: countdownToExtinctionRedI18n,
  yellow: countdownToExtinctionYellowI18n,
  blue: countdownToExtinctionBlueI18n,
} = countdownToExtinctionI18n.cards;
