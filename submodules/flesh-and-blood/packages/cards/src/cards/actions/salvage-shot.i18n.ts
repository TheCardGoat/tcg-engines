import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { salvageShot } from "./salvage-shot.ts";

export const salvageShotI18n = defineFamilyI18n(salvageShot, {
  en: {
    name: "Salvage Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "When this hits, put it on the bottom of its owner's deck.",
  },
});

export const {
  red: salvageShotRedI18n,
  yellow: salvageShotYellowI18n,
  blue: salvageShotBlueI18n,
} = salvageShotI18n.cards;
