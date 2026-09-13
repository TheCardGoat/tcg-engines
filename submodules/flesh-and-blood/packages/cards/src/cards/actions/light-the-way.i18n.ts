import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lightTheWay } from "./light-the-way.ts";

export const lightTheWayI18n = defineFamilyI18n(lightTheWay, {
  en: {
    name: "Light the Way",
    text: "As an additional cost to play this, you may charge your hero's soul.\nWhen this hits, if a yellow card was charged this way, this gets go again.",
    typeText: "Light Warrior Action - Attack",
  },
});

export const {
  red: lightTheWayRedI18n,
  yellow: lightTheWayYellowI18n,
  blue: lightTheWayBlueI18n,
} = lightTheWayI18n.cards;
