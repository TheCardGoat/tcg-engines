import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { legTap } from "./leg-tap.ts";

export const legTapI18n = defineFamilyI18n(legTap, {
  en: {
    name: "Leg Tap",
    text: "Go again",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: legTapRedI18n,
  yellow: legTapYellowI18n,
  blue: legTapBlueI18n,
} = legTapI18n.cards;
