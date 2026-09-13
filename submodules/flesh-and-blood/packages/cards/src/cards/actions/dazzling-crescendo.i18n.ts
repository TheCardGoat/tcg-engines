import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dazzlingCrescendo } from "./dazzling-crescendo.ts";

export const dazzlingCrescendoI18n = defineFamilyI18n(dazzlingCrescendo, {
  en: {
    name: "Dazzling Crescendo",
    text: "Lightning Fusion\nIf Dazzling Crescendo was fused, it gains go again.",
    typeText: "Elemental Ranger Action - Arrow Attack",
  },
});

export const {
  red: dazzlingCrescendoRedI18n,
  yellow: dazzlingCrescendoYellowI18n,
  blue: dazzlingCrescendoBlueI18n,
} = dazzlingCrescendoI18n.cards;
