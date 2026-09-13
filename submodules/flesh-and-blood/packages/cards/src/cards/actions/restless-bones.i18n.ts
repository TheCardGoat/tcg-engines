import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restlessBones } from "./restless-bones.ts";

export const restlessBonesI18n = defineFamilyI18n(restlessBones, {
  en: {
    name: "Restless Bones",
    text: "When this attacks, you may discard a card or destroy the top card of your deck. If that card has watery grave, this gets go again.",
    typeText: "Pirate Necromancer Action - Attack",
  },
});
export const {
  red: restlessBonesRedI18n,
  yellow: restlessBonesYellowI18n,
  blue: restlessBonesBlueI18n,
} = restlessBonesI18n.cards;
