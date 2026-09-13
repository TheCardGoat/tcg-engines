import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pathingHelix } from "./pathing-helix.ts";

export const pathingHelixI18n = defineFamilyI18n(pathingHelix, {
  en: {
    name: "Pathing Helix",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Pathing Helix hits and you have no cards in your arsenal, you may put a card from your hand face down into your arsenal.",
  },
});

export const {
  red: pathingHelixRedI18n,
  yellow: pathingHelixYellowI18n,
  blue: pathingHelixBlueI18n,
} = pathingHelixI18n.cards;
