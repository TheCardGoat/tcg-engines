import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clashOfArms } from "./clash-of-arms.ts";

export const clashOfArmsI18n = defineFamilyI18n(clashOfArms, {
  en: {
    name: "Clash of Arms",
    text: "When this defends a Guardian attack, clash with the attacking hero. If there is a winner, the other hero puts a -1{d} counter on an arms they have equipped. If they don't, they lose 1{h}.",
    typeText: "Guardian Block",
  },
});

export const { yellow: clashOfArmsYellowI18n } = clashOfArmsI18n.cards;
