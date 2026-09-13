import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { explosiveGrowth } from "./explosive-growth.ts";

export const explosiveGrowthI18n = defineFamilyI18n(explosiveGrowth, {
  en: {
    name: "Explosive Growth",
    text: "Earth Fusion\nIf Explosive Growth was fused, whenever it deals damage, attacks gain +1{p} this combat chain.\nWhen you attack with Explosive Growth, deal 1 arcane damage to target hero.",
    typeText: "Elemental Runeblade Action - Attack",
  },
});

export const {
  red: explosiveGrowthRedI18n,
  yellow: explosiveGrowthYellowI18n,
  blue: explosiveGrowthBlueI18n,
} = explosiveGrowthI18n.cards;
