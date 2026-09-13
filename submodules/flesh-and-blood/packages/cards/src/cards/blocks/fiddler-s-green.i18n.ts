import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fiddlerSGreen } from "./fiddler-s-green.ts";

export const fiddlerSGreenI18n = defineFamilyI18n(fiddlerSGreen, {
  en: {
    name: "Fiddler's Green",
    typeText: "Generic Block",
    text: ({ lifeGain }) =>
      `When this is put into your graveyard from anywhere, gain ${lifeGain}{h}.`,
  },
});

export const {
  red: fiddlerSGreenRedI18n,
  yellow: fiddlerSGreenYellowI18n,
  blue: fiddlerSGreenBlueI18n,
} = fiddlerSGreenI18n.cards;
