import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flash } from "./flash.ts";

export const flashI18n = defineFamilyI18n(flash, {
  en: {
    name: "Flash",
    text: "The next action card you play this turn with cost 0 or greater gets go again.\nGo again",
    typeText: "Lightning Action",
  },
});
export const { red: flashRedI18n, yellow: flashYellowI18n, blue: flashBlueI18n } = flashI18n.cards;
