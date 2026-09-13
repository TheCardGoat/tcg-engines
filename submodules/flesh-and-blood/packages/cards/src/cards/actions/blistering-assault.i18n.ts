import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blisteringAssault } from "./blistering-assault.ts";

export const blisteringAssaultI18n = defineFamilyI18n(blisteringAssault, {
  en: {
    name: "Blistering Assault",
    typeText: "Light Action - Attack",
    text: "If you have a yellow card in your pitch zone, this gets go again.",
  },
});

export const {
  red: blisteringAssaultRedI18n,
  yellow: blisteringAssaultYellowI18n,
  blue: blisteringAssaultBlueI18n,
} = blisteringAssaultI18n.cards;
