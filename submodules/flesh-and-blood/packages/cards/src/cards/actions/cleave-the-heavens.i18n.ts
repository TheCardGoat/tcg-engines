import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cleaveTheHeavens } from "./cleave-the-heavens.ts";

export const cleaveTheHeavensI18n = defineFamilyI18n(cleaveTheHeavens, {
  en: {
    name: "Cleave the Heavens",
    typeText: "Shadow Brute Action - Attack",
    text: "Instant - Banish this from your hand: Create a Gate to i'Arathael token.\nBlood Debt",
  },
});

export const {
  red: cleaveTheHeavensRedI18n,
  yellow: cleaveTheHeavensYellowI18n,
  blue: cleaveTheHeavensBlueI18n,
} = cleaveTheHeavensI18n.cards;
