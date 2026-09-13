import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { jitteryBones } from "./jittery-bones.ts";

export const jitteryBonesI18n = defineFamilyI18n(jitteryBones, {
  en: {
    name: "Jittery Bones",
    text: "When this attacks, you may discard a card or destroy the top card of your deck. If that card has watery grave, this gets go again.",
    typeText: "Pirate Necromancer Action - Attack",
  },
});
export const {
  red: jitteryBonesRedI18n,
  yellow: jitteryBonesYellowI18n,
  blue: jitteryBonesBlueI18n,
} = jitteryBonesI18n.cards;
