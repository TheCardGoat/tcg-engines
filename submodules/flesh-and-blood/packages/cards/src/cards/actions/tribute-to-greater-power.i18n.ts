import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tributeToGreaterPower } from "./tribute-to-greater-power.ts";

export const tributeToGreaterPowerI18n = defineFamilyI18n(tributeToGreaterPower, {
  en: {
    name: "Tribute to Greater Power",
    typeText: "Shadow Action - Attack",
    text: "Instant - Banish this from your hand: Your next attack this turn gets overpower.\nBlood Debt",
  },
});

export const { red: tributeToGreaterPowerRedI18n } = tributeToGreaterPowerI18n.cards;
