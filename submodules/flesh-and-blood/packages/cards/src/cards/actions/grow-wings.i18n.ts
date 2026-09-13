import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { growWings } from "./grow-wings.ts";

export const growWingsI18n = defineFamilyI18n(growWings, {
  en: {
    name: "Grow Wings",
    text: "If a Draconic attack was the last attack this combat chain, this gets go again.",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: growWingsRedI18n,
  yellow: growWingsYellowI18n,
  blue: growWingsBlueI18n,
} = growWingsI18n.cards;
