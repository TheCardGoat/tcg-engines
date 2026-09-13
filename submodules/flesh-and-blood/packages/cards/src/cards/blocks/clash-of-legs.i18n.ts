import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clashOfLegs } from "./clash-of-legs.ts";

export const clashOfLegsI18n = defineFamilyI18n(clashOfLegs, {
  en: {
    name: "Clash of Legs",
    text: "When this defends a Guardian attack, clash with the attacking hero. If there is a winner, the other hero puts a -1{d} counter on a legs they have equipped. If they don't, they lose 1{h}.",
    typeText: "Guardian Block",
  },
});

export const { yellow: clashOfLegsYellowI18n } = clashOfLegsI18n.cards;
