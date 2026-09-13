import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { burlyBones } from "./burly-bones.ts";

export const burlyBonesI18n = defineFamilyI18n(burlyBones, {
  en: {
    name: "Burly Bones",
    text: "When this attacks, you may discard a card or destroy the top card of your deck. If that card has watery grave, this gets overpower.",
    typeText: "Pirate Necromancer Action - Attack",
  },
});
export const {
  red: burlyBonesRedI18n,
  yellow: burlyBonesYellowI18n,
  blue: burlyBonesBlueI18n,
} = burlyBonesI18n.cards;
