import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clashOfChests } from "./clash-of-chests.ts";

export const clashOfChestsI18n = defineFamilyI18n(clashOfChests, {
  en: {
    name: "Clash of Chests",
    text: "When this defends a Guardian attack, clash with the attacking hero. If there is a winner, the other hero puts a -1{d} counter on a chest they have equipped. If they don't, they lose 1{h}.",
    typeText: "Guardian Block",
  },
});

export const { yellow: clashOfChestsYellowI18n } = clashOfChestsI18n.cards;
