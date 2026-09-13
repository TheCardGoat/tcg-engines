import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clashOfShields } from "./clash-of-shields.ts";

export const clashOfShieldsI18n = defineFamilyI18n(clashOfShields, {
  en: {
    name: "Clash of Shields",
    text: "When this defends a Guardian attack, clash with the attacking hero. If there is a winner, the other hero puts a -1{d} counter on an off-hand they have equipped. If they don't, they lose 1{h}.",
    typeText: "Guardian Block",
  },
});

export const { yellow: clashOfShieldsYellowI18n } = clashOfShieldsI18n.cards;
