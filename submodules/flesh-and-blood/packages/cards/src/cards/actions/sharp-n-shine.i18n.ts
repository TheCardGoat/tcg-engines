import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sharpNShine } from "./sharp-n-shine.ts";

export const sharpNShineI18n = defineFamilyI18n(sharpNShine, {
  en: {
    name: "Sharp 'n Shine",
    typeText: "Warrior Action",
    text: (threshold) =>
      `Sharpen target sword you control.\nIf it has ${threshold} or more +1{p} counters, create a Blade Dance token.\nGo again`,
  },
});

export const {
  red: sharpNShineRedI18n,
  yellow: sharpNShineYellowI18n,
  blue: sharpNShineBlueI18n,
} = sharpNShineI18n.cards;
