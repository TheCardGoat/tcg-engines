import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { malignantMigration } from "./malignant-migration.ts";

export const malignantMigrationI18n = defineFamilyI18n(malignantMigration, {
  en: {
    name: "Malignant Migration",
    typeText: "Shadow Necromancer Action - Attack",
    text: "When this attacks, you may discard a zombie. If you do, put a card from your banished zone into your graveyard.\nGo again",
  },
});

export const {
  red: malignantMigrationRedI18n,
  yellow: malignantMigrationYellowI18n,
  blue: malignantMigrationBlueI18n,
} = malignantMigrationI18n.cards;
