import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { brambleSpark } from "./bramble-spark.ts";

export const brambleSparkI18n = defineFamilyI18n(brambleSpark, {
  en: {
    name: "Bramble Spark",
    text: 'Earth Fusion\nThe next attack action card you play this turn gains "When you attack with this, deal 1 arcane damage to target hero."\nIf Bramble Spark was fused, the next attack action card you play this turn gains +3{p}.\nGo again',
    typeText: "Elemental Runeblade Action",
  },
});
export const {
  red: brambleSparkRedI18n,
  yellow: brambleSparkYellowI18n,
  blue: brambleSparkBlueI18n,
} = brambleSparkI18n.cards;
