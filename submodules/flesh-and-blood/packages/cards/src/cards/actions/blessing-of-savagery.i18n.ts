import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfSavagery } from "./blessing-of-savagery.ts";

export const blessingOfSavageryI18n = defineFamilyI18n(blessingOfSavagery, {
  en: {
    name: "Blessing of Savagery",
    text: (amount) =>
      `At the start of your turn, destroy Blessing of Savagery then your next attack with 6 or more base {p} this turn gains +${amount}{p}.`,
    typeText: "Brute Action - Aura",
  },
});

export const {
  red: blessingOfSavageryRedI18n,
  yellow: blessingOfSavageryYellowI18n,
  blue: blessingOfSavageryBlueI18n,
} = blessingOfSavageryI18n.cards;
