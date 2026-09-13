import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { barragingBigHorn } from "./barraging-big-horn.ts";

export const barragingBigHornI18n = defineFamilyI18n(barragingBigHorn, {
  en: {
    name: "Barraging Big Horn",
    text: "As an additional cost to play Barraging Big Horn, discard a random card.\nWhile Barraging Big Horn is defended by less than 2 non-equipment cards, it has go again.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: barragingBigHornRedI18n,
  yellow: barragingBigHornYellowI18n,
  blue: barragingBigHornBlueI18n,
} = barragingBigHornI18n.cards;
