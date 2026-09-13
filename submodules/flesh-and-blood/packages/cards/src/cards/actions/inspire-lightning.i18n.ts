import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { inspireLightning } from "./inspire-lightning.ts";

export const inspireLightningI18n = defineFamilyI18n(inspireLightning, {
  en: {
    name: "Inspire Lightning",
    text: "Lightning Fusion\nIf Inspire Lightning was fused, deal 3 arcane damage to target hero.",
    typeText: "Elemental Runeblade Action",
  },
});
export const {
  red: inspireLightningRedI18n,
  yellow: inspireLightningYellowI18n,
  blue: inspireLightningBlueI18n,
} = inspireLightningI18n.cards;
