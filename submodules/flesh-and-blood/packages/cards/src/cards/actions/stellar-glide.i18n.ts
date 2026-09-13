import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stellarGlide } from "./stellar-glide.ts";

export const stellarGlideI18n = defineFamilyI18n(stellarGlide, {
  en: {
    name: "Stellar Glide",
    typeText: "Lightning Action - Attack",
    text: "When this attacks, you may destroy a Lightning Flow you control. If you do, this gets go again.",
  },
});

export const {
  red: stellarGlideRedI18n,
  yellow: stellarGlideYellowI18n,
  blue: stellarGlideBlueI18n,
} = stellarGlideI18n.cards;
