import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hungeringSlaughterbeast } from "./hungering-slaughterbeast.ts";

export const hungeringSlaughterbeastI18n = defineFamilyI18n(hungeringSlaughterbeast, {
  en: {
    name: "Hungering Slaughterbeast",
    text: "As an additional cost to play Hungering Slaughterbeast, banish 3 random cards from your graveyard.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: hungeringSlaughterbeastRedI18n,
  yellow: hungeringSlaughterbeastYellowI18n,
  blue: hungeringSlaughterbeastBlueI18n,
} = hungeringSlaughterbeastI18n.cards;
