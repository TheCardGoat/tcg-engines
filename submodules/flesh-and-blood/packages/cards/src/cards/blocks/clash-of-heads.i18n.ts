import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clashOfHeads } from "./clash-of-heads.ts";

export const clashOfHeadsI18n = defineFamilyI18n(clashOfHeads, {
  en: {
    name: "Clash of Heads",
    text: "When this defends a Guardian attack, clash with the attacking hero. If there is a winner, the other hero puts a -1{d} counter on a head they have equipped. If they don't, they lose 1{h}.",
    typeText: "Guardian Block",
  },
});

export const { yellow: clashOfHeadsYellowI18n } = clashOfHeadsI18n.cards;
