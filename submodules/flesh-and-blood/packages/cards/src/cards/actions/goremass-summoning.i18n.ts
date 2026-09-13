import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { goremassSummoning } from "./goremass-summoning.ts";

export const goremassSummoningI18n = defineFamilyI18n(goremassSummoning, {
  en: {
    name: "Goremass Summoning",
    typeText: "Shadow Brute Action",
    text: "If you've banished a card with 6 or more {p} this turn, create a Blasmophet, the Insatiable Hunger token.\nGo again",
  },
});

export const { blue: goremassSummoningBlueI18n } = goremassSummoningI18n.cards;
