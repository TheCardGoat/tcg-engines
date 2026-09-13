import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { breakGround } from "./break-ground.ts";

export const breakGroundI18n = defineFamilyI18n(breakGround, {
  en: {
    name: "Break Ground",
    text: "When you attack with Break Ground, you may put a card from your arsenal on the bottom of your deck. If you do, draw a card.",
    typeText: "Earth Action - Attack",
  },
});

export const {
  red: breakGroundRedI18n,
  yellow: breakGroundYellowI18n,
  blue: breakGroundBlueI18n,
} = breakGroundI18n.cards;
