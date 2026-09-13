import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { swiftwaterSloop } from "./swiftwater-sloop.ts";

export const swiftwaterSloopI18n = defineFamilyI18n(swiftwaterSloop, {
  en: {
    name: "Swiftwater Sloop",
    text: "High Tide - If there are 2 or more blue cards in your pitch zone, this gets go again.",
    typeText: "Pirate Action - Attack",
  },
});
export const {
  red: swiftwaterSloopRedI18n,
  yellow: swiftwaterSloopYellowI18n,
  blue: swiftwaterSloopBlueI18n,
} = swiftwaterSloopI18n.cards;
