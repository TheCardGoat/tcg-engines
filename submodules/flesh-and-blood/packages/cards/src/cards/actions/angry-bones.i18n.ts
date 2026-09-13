import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { angryBones } from "./angry-bones.ts";

export const angryBonesI18n = defineFamilyI18n(angryBones, {
  en: {
    name: "Angry Bones",
    text: "When this attacks, you may discard a card or destroy the top card of your deck. If that card has watery grave, this gets +1{p}.",
    typeText: "Pirate Necromancer Action - Attack",
  },
});
export const {
  red: angryBonesRedI18n,
  yellow: angryBonesYellowI18n,
  blue: angryBonesBlueI18n,
} = angryBonesI18n.cards;
