import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { crashDownTheGates } from "./crash-down-the-gates.ts";

export const crashDownTheGatesI18n = defineFamilyI18n(crashDownTheGates, {
  en: {
    name: "Crash Down the Gates",
    typeText: "Generic Action - Attack",
    text: "When this attacks a hero, they reveal the top card of their deck. If this has {p} greater than the revealed card, this gets +2{p}.\nWhen this hits a hero, destroy the top card of their deck.",
  },
});

export const {
  red: crashDownTheGatesRedI18n,
  yellow: crashDownTheGatesYellowI18n,
  blue: crashDownTheGatesBlueI18n,
} = crashDownTheGatesI18n.cards;
