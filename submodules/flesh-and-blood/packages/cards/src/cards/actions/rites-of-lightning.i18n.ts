import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ritesOfLightning } from "./rites-of-lightning.ts";

export const ritesOfLightningI18n = defineFamilyI18n(ritesOfLightning, {
  en: {
    name: "Rites of Lightning",
    text: "Lightning Fusion\nWhen you attack with Rites of Lightning, if it was fused, deal 1 arcane damage to target hero.\nIf you have dealt arcane damage this turn, Rites of Lightning gains go again.",
    typeText: "Elemental Runeblade Action - Attack",
  },
});

export const {
  red: ritesOfLightningRedI18n,
  yellow: ritesOfLightningYellowI18n,
  blue: ritesOfLightningBlueI18n,
} = ritesOfLightningI18n.cards;
