import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flexSpeed } from "./flex-speed.ts";

export const flexSpeedI18n = defineFamilyI18n(flexSpeed, {
  en: {
    name: "Flex Speed",
    text: "If this has 6 or more {p}, it gets go again.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: flexSpeedRedI18n,
  yellow: flexSpeedYellowI18n,
  blue: flexSpeedBlueI18n,
} = flexSpeedI18n.cards;
