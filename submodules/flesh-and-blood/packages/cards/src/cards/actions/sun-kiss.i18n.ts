import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sunKiss } from "./sun-kiss.ts";

export const sunKissI18n = defineFamilyI18n(sunKiss, {
  en: {
    name: "Sun Kiss",
    typeText: "Generic Action",
    text: ({ amount }) =>
      `Gain ${amount}{h}.\nIf you have played a card named Moon Wish this turn, draw a card and Sun Kiss gains go again.`,
  },
});

export const {
  red: sunKissRedI18n,
  yellow: sunKissYellowI18n,
  blue: sunKissBlueI18n,
} = sunKissI18n.cards;
