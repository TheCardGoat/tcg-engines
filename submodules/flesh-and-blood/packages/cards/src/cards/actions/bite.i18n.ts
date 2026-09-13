import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bite } from "./bite.ts";

export const biteI18n = defineFamilyI18n(bite, {
  en: {
    name: "Bite",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nWhen this attacks a hero, you may have target dagger you control deal 1 damage to them. If damage is dealt this way, the dagger has hit. Destroy the dagger.",
  },
});

export const { red: biteRedI18n, yellow: biteYellowI18n, blue: biteBlueI18n } = biteI18n.cards;
