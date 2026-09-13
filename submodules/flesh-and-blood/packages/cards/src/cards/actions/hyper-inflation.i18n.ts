import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hyperInflation } from "./hyper-inflation.ts";

export const hyperInflationI18n = defineFamilyI18n(hyperInflation, {
  en: {
    name: "Hyper Inflation",
    text: "When this attacks, cards cost {r} more to play this turn.\nGo again",
    typeText: "Chaos Action - Attack",
  },
});
export const {
  red: hyperInflationRedI18n,
  yellow: hyperInflationYellowI18n,
  blue: hyperInflationBlueI18n,
} = hyperInflationI18n.cards;
