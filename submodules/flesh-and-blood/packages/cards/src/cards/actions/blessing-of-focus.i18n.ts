import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfFocus } from "./blessing-of-focus.ts";

export const blessingOfFocusI18n = defineFamilyI18n(blessingOfFocus, {
  en: {
    name: "Blessing of Focus",
    text: ({ textValue1 }) =>
      `At the start of your turn, destroy this then opt ${textValue1} and reveal the top card of your deck. If it's an arrow, put it face-up into your arsenal with an aim counter.`,
    typeText: "Ranger Action - Aura",
  },
});

export const {
  red: blessingOfFocusRedI18n,
  yellow: blessingOfFocusYellowI18n,
  blue: blessingOfFocusBlueI18n,
} = blessingOfFocusI18n.cards;
