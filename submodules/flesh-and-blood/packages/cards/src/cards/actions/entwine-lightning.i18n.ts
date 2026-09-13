import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { entwineLightning } from "./entwine-lightning.ts";

export const entwineLightningI18n = defineFamilyI18n(entwineLightning, {
  en: {
    name: "Entwine Lightning",
    text: "Lightning Fusion\nIf Entwine Lightning was fused, it gains go again.",
    typeText: "Elemental Action - Attack",
  },
});
export const {
  red: entwineLightningRedI18n,
  yellow: entwineLightningYellowI18n,
  blue: entwineLightningBlueI18n,
} = entwineLightningI18n.cards;
