import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { entwineIce } from "./entwine-ice.ts";

export const entwineIceI18n = defineFamilyI18n(entwineIce, {
  en: {
    name: "Entwine Ice",
    text: "Ice Fusion\nIf Entwine Ice was fused, it gains dominate.",
    typeText: "Elemental Action - Attack",
  },
});
export const {
  red: entwineIceRedI18n,
  yellow: entwineIceYellowI18n,
  blue: entwineIceBlueI18n,
} = entwineIceI18n.cards;
