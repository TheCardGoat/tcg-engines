import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { glisten } from "./glisten.ts";

export const glistenI18n = defineFamilyI18n(glisten, {
  en: {
    name: "Glisten",
    typeText: "Light Instant",
    text: ({ amount }) =>
      `Distribute up to ${amount} +1{p} counters among any number of weapons you control.\nAt the beginning of your end phase, remove all +1{p} counters from weapons you control.`,
  },
});

export const {
  red: glistenRedI18n,
  yellow: glistenYellowI18n,
  blue: glistenBlueI18n,
} = glistenI18n.cards;
