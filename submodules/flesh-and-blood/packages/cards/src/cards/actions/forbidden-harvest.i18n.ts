import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { forbiddenHarvest } from "./forbidden-harvest.ts";

export const forbiddenHarvestI18n = defineFamilyI18n(forbiddenHarvest, {
  en: {
    name: "Forbidden Harvest",
    typeText: "Shadow Runeblade Action",
    text: "Turn up to 3 cards in your banished zone face-down, then create a Runechant token for each Shadow card turned face-down this way.\nGo again",
  },
});

export const { yellow: forbiddenHarvestYellowI18n } = forbiddenHarvestI18n.cards;
