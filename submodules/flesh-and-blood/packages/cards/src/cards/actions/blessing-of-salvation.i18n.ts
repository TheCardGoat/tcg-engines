import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfSalvation } from "./blessing-of-salvation.ts";

export const blessingOfSalvationI18n = defineFamilyI18n(blessingOfSalvation, {
  en: {
    name: "Blessing of Salvation",
    text: ({ lifeGain }) =>
      `If a card has been put into your soul this turn, you may play this as though it were an instant.
Gain ${lifeGain}{h}`,
    typeText: "Light Action",
  },
});

export const {
  red: blessingOfSalvationRedI18n,
  yellow: blessingOfSalvationYellowI18n,
  blue: blessingOfSalvationBlueI18n,
} = blessingOfSalvationI18n.cards;
