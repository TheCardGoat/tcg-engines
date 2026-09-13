import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { seedsOfAgony } from "./seeds-of-agony.ts";

export const seedsOfAgonyI18n = defineFamilyI18n(seedsOfAgony, {
  en: {
    name: "Seeds of Agony",
    text: (maxCost) =>
      `You may play Seeds of Agony from your banished zone.\nThe next attack action card with cost ${maxCost} or less you play this turn gains "When you attack with this, deal 1 arcane damage to target hero."\nGo again\nBlood Debt`,
    typeText: "Shadow Runeblade Action",
  },
});

export const {
  red: seedsOfAgonyRedI18n,
  yellow: seedsOfAgonyYellowI18n,
  blue: seedsOfAgonyBlueI18n,
} = seedsOfAgonyI18n.cards;
