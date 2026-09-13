import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { consumingLash } from "./consuming-lash.ts";

export const consumingLashI18n = defineFamilyI18n(consumingLash, {
  en: {
    name: "Consuming Lash",
    typeText: "Shadow Brute Action - Attack",
    text: "Play this only if you control a Blasmophet.\nInstant - {r}, banish this from your hand: Your next attack this turn gets go again.\nBlood Debt",
  },
});

export const { yellow: consumingLashYellowI18n } = consumingLashI18n.cards;
