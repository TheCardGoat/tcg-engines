import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shred } from "./shred.ts";

export const shredI18n = defineFamilyI18n(shred, {
  en: {
    name: "Shred",
    typeText: "Assassin Attack Reaction",
    text: (amount) =>
      `Target card defending an Assassin attack gets -${amount}{d} this combat chain.`,
  },
});
export const { red: shredRedI18n, yellow: shredYellowI18n, blue: shredBlueI18n } = shredI18n.cards;
