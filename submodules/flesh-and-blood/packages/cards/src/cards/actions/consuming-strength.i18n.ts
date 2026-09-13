import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { consumingStrength } from "./consuming-strength.ts";

export const consumingStrengthI18n = defineFamilyI18n(consumingStrength, {
  en: {
    name: "Consuming Strength",
    typeText: "Shadow Brute Action - Attack",
    text: "Play this only if you control a Blasmophet.\nInstant - {r}, banish this from your hand: Your next attack this turn gets +2{p}.\nBlood Debt",
  },
});

export const { yellow: consumingStrengthYellowI18n } = consumingStrengthI18n.cards;
