import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { harvestSeason } from "./harvest-season.ts";

export const harvestSeasonI18n = defineFamilyI18n(harvestSeason, {
  en: {
    name: "Harvest Season",
    text: "Go again\nAt the beginning of your action phase, destroy this, then gain 3{h}.",
    typeText: "Earth Action - Aura",
  },
});
export const {
  red: harvestSeasonRedI18n,
  yellow: harvestSeasonYellowI18n,
  blue: harvestSeasonBlueI18n,
} = harvestSeasonI18n.cards;
