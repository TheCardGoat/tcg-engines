import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { reincarnate } from "./reincarnate.ts";

export const reincarnateI18n = defineFamilyI18n(reincarnate, {
  en: {
    name: "Reincarnate",
    text: "When this is discarded at random, put it on the bottom of its owner's deck.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: reincarnateRedI18n,
  yellow: reincarnateYellowI18n,
  blue: reincarnateBlueI18n,
} = reincarnateI18n.cards;
