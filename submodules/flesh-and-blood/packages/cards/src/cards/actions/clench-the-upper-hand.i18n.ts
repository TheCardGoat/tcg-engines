import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clenchTheUpperHand } from "./clench-the-upper-hand.ts";

export const clenchTheUpperHandI18n = defineFamilyI18n(clenchTheUpperHand, {
  en: {
    name: "Clench the Upper Hand",
    text: "When this attacks or defends, if you have less {h} than each other hero, the crowd boos you.",
    typeText: "Reviled Action - Attack",
  },
});
export const {
  red: clenchTheUpperHandRedI18n,
  yellow: clenchTheUpperHandYellowI18n,
  blue: clenchTheUpperHandBlueI18n,
} = clenchTheUpperHandI18n.cards;
