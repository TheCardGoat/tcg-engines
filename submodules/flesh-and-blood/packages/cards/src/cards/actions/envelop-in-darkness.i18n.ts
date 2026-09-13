import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { envelopInDarkness } from "./envelop-in-darkness.ts";

export const envelopInDarknessI18n = defineFamilyI18n(envelopInDarkness, {
  en: {
    name: "Envelop in Darkness",
    text: (amount) =>
      `Create a Runechant token.\nThe next attack action card you rune gate this turn gets +${amount}{p}.\nGo again`,
    typeText: "Shadow Runeblade Action",
  },
});

export const {
  red: envelopInDarknessRedI18n,
  yellow: envelopInDarknessYellowI18n,
  blue: envelopInDarknessBlueI18n,
} = envelopInDarknessI18n.cards;
