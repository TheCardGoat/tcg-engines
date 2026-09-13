import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stirTheWildwood } from "./stir-the-wildwood.ts";

export const stirTheWildwoodI18n = defineFamilyI18n(stirTheWildwood, {
  en: {
    name: "Stir the Wildwood",
    text: "Earth Fusion\nIf you have dealt arcane damage to an opposing hero this turn, Stir the Wildwood gains +2{p}.\nIf Stir the Wildwood was fused, it gains +2{p}.",
    typeText: "Elemental Runeblade Action - Attack",
  },
});

export const {
  red: stirTheWildwoodRedI18n,
  yellow: stirTheWildwoodYellowI18n,
  blue: stirTheWildwoodBlueI18n,
} = stirTheWildwoodI18n.cards;
