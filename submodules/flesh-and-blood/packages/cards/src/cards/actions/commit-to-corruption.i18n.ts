import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { commitToCorruption } from "./commit-to-corruption.ts";

export const commitToCorruptionI18n = defineFamilyI18n(commitToCorruption, {
  en: {
    name: "Commit to Corruption",
    typeText: "Shadow Necromancer Action",
    text: 'Your next attack this turn gets +3{p} and "When this hits, create a Corrupted Corpse in your banished zone."\nGo again',
  },
});

export const {
  red: commitToCorruptionRedI18n,
  yellow: commitToCorruptionYellowI18n,
  blue: commitToCorruptionBlueI18n,
} = commitToCorruptionI18n.cards;
