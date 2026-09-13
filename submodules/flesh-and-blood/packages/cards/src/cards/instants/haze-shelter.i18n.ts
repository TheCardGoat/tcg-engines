import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hazeShelter } from "./haze-shelter.ts";

export const hazeShelterI18n = defineFamilyI18n(hazeShelter, {
  en: {
    name: "Haze Shelter",
    typeText: "Mystic Illusionist Instant - Aura",
    text: ({ pitchedBlueWard }) =>
      `Ward X, where X is ${pitchedBlueWard} if you've pitched a blue card this turn, otherwise X is 1.`,
  },
});

export const {
  red: hazeShelterRedI18n,
  yellow: hazeShelterYellowI18n,
  blue: hazeShelterBlueI18n,
} = hazeShelterI18n.cards;
