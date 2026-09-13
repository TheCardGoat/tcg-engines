import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { favorableWinds } from "./favorable-winds.ts";

export const favorableWindsI18n = defineFamilyI18n(favorableWinds, {
  en: {
    name: "Favorable Winds",
    typeText: "Pirate Ranger Action",
    text: "As an additional cost to play this, discard a Goldfin Harpoon.\nDraw 2 cards.\nGo again",
  },
});

export const { yellow: favorableWindsYellowI18n } = favorableWindsI18n.cards;
