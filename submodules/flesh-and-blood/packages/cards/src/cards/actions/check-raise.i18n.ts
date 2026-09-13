import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { checkRaise } from "./check-raise.ts";

export const checkRaiseI18n = defineFamilyI18n(checkRaise, {
  en: {
    name: "Check-Raise",
    typeText: "Warrior Action",
    text: (amount) =>
      `The next time an attack you control wagers this turn, it gets +${amount}{p}.\nGo again`,
  },
});

export const {
  red: checkRaiseRedI18n,
  yellow: checkRaiseYellowI18n,
  blue: checkRaiseBlueI18n,
} = checkRaiseI18n.cards;
