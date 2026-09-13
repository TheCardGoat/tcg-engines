import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bitteringThorns } from "./bittering-thorns.ts";

export const bitteringThornsI18n = defineFamilyI18n(bitteringThorns, {
  en: {
    name: "Bittering Thorns",
    typeText: "Ninja Action - Attack",
    text: "When this hits, your next attack this turn gets +1{p}.\nGo again",
  },
});

export const {
  red: bitteringThornsRedI18n,
  yellow: bitteringThornsYellowI18n,
  blue: bitteringThornsBlueI18n,
} = bitteringThornsI18n.cards;
