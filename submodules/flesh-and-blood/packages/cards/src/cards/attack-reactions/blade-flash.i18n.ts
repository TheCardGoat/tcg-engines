import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bladeFlash } from "./blade-flash.ts";

export const bladeFlashI18n = defineFamilyI18n(bladeFlash, {
  en: {
    name: "Blade Flash",
    typeText: "Generic Attack Reaction",
    text: "Target sword attack gains go again.",
  },
});

export const { blue: bladeFlashBlueI18n } = bladeFlashI18n.cards;
