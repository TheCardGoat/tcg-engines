import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { savageFeast } from "./savage-feast.ts";

export const savageFeastI18n = defineFamilyI18n(savageFeast, {
  en: {
    name: "Savage Feast",
    text: "As an additional cost to play Savage Feast discard a random card.\nWhen you attack with Savage Feast, if a card with 6 or more {p} was discarded as an additional cost to play it, draw a card.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: savageFeastRedI18n,
  yellow: savageFeastYellowI18n,
  blue: savageFeastBlueI18n,
} = savageFeastI18n.cards;
