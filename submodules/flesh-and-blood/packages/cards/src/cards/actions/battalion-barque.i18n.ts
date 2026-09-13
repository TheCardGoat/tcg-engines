import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { battalionBarque } from "./battalion-barque.ts";

export const battalionBarqueI18n = defineFamilyI18n(battalionBarque, {
  en: {
    name: "Battalion Barque",
    text: "High Tide - If there are 2 or more blue cards in your pitch zone, this gets +2{p}.",
    typeText: "Pirate Action - Attack",
  },
});
export const {
  red: battalionBarqueRedI18n,
  yellow: battalionBarqueYellowI18n,
  blue: battalionBarqueBlueI18n,
} = battalionBarqueI18n.cards;
