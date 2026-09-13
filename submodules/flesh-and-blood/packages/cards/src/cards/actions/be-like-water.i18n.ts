import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { beLikeWater } from "./be-like-water.ts";

export const beLikeWaterI18n = defineFamilyI18n(beLikeWater, {
  en: {
    name: "Be Like Water",
    typeText: "Ninja Action - Attack",
    text: "When this hits, you may pay {r}. If you do, choose Head Jab, Surging Strike, or Twin Twisters. This gains the chosen name.\nGo again",
  },
});

export const {
  red: beLikeWaterRedI18n,
  yellow: beLikeWaterYellowI18n,
  blue: beLikeWaterBlueI18n,
} = beLikeWaterI18n.cards;
