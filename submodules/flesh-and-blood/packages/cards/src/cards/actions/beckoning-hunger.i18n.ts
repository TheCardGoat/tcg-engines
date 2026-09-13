import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { beckoningHunger } from "./beckoning-hunger.ts";

export const beckoningHungerI18n = defineFamilyI18n(beckoningHunger, {
  en: {
    name: "Beckoning Hunger",
    text: "When this attacks, banish the top card of your deck.\nWhen this hits, create a Blasmophet, the Insatiable Hunger token.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: beckoningHungerRedI18n,
  yellow: beckoningHungerYellowI18n,
  blue: beckoningHungerBlueI18n,
} = beckoningHungerI18n.cards;
