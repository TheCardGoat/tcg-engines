import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { satiateBloodthirst } from "./satiate-bloodthirst.ts";

export const satiateBloodthirstI18n = defineFamilyI18n(satiateBloodthirst, {
  en: {
    name: "Satiate Bloodthirst",
    typeText: "Shadow Brute Action - Attack",
    text: "Instant - Banish this from your hand: Gain 1{h}\nBlood Debt",
  },
});

export const {
  red: satiateBloodthirstRedI18n,
  yellow: satiateBloodthirstYellowI18n,
  blue: satiateBloodthirstBlueI18n,
} = satiateBloodthirstI18n.cards;
