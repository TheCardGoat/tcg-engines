import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { strengthOfFourSeasons } from "./strength-of-four-seasons.ts";

export const strengthOfFourSeasonsI18n = defineFamilyI18n(strengthOfFourSeasons, {
  en: {
    name: "Strength of Four Seasons",
    text: "If there are 4 or more Earth cards in your banished zone, this gets +4{p}.",
    typeText: "Earth Action - Attack",
  },
});

export const {
  red: strengthOfFourSeasonsRedI18n,
  yellow: strengthOfFourSeasonsYellowI18n,
  blue: strengthOfFourSeasonsBlueI18n,
} = strengthOfFourSeasonsI18n.cards;
