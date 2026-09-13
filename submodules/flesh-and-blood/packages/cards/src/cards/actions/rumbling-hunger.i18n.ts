import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rumblingHunger } from "./rumbling-hunger.ts";

export const rumblingHungerI18n = defineFamilyI18n(rumblingHunger, {
  en: {
    name: "Rumbling Hunger",
    typeText: "Shadow Brute Action - Attack",
    text: "When this hits, if you've banished a card with 6 or more {p} this turn, create a Blasmophet, the Insatiable Hunger token and this gets go again.\nBlood Debt",
  },
});

export const {
  red: rumblingHungerRedI18n,
  yellow: rumblingHungerYellowI18n,
  blue: rumblingHungerBlueI18n,
} = rumblingHungerI18n.cards;
